import React, { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import {
  Camera,
  X,
  RefreshCw,
  Sparkles,
  Sliders,
  Check,
  ShoppingBag,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  Search,
  Download,
  Share2,
  Eye,
  ChevronLeft,
  Filter,
  CheckCircle2,
  FlipHorizontal,
  Maximize2,
  SlidersHorizontal,
  Settings2,
  Shield,
  HelpCircle,
  Box,
  Layers,
} from "lucide-react";
import { Product, FrameShape, ColorOption } from "../types";
import {
  getFaceLandmarker,
  calculateLandmarkTransform,
  SmoothingTracker,
  DEFAULT_CALIBRATION,
  SmoothedTransform,
} from "../lib/arFaceTracker";
import { ThreeGlassesRenderer } from "../lib/threeGlassesRenderer";

interface TryOnViewProps {
  initialProductId?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const TryOnView: React.FC<TryOnViewProps> = ({
  initialProductId,
  isModal = false,
  onCloseModal,
}) => {
  const {
    products,
    addToCart,
    openLensCustomizer,
    toggleWishlist,
    isInWishlist,
    setActiveView,
    showNotification,
  } = useApp();

  // Selected Product & Color State
  const [currentProduct, setCurrentProduct] = useState<Product>(() => {
    if (initialProductId) {
      const found = products.find((p) => p.id === initialProductId);
      if (found) return found;
    }
    return products.find((p) => p.category !== "contacts") || products[0];
  });

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Camera & Try-On Modes
  type CameraState =
    | "idle"
    | "requesting"
    | "loading"
    | "active"
    | "error"
    | "photo"
    | "result";

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading3dModel, setIsLoading3dModel] = useState<boolean>(false);

  // AR Tracking Feedback
  const [faceStatus, setFaceStatus] = useState<"searching" | "detected" | "holding" | "lost">("searching");
  const [statusText, setStatusText] = useState<string>("Finding your face & eye landmarks...");
  const [hideInstruction, setHideInstruction] = useState<boolean>(false);

  // Canvas & Video Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const photoThreeCanvasRef = useRef<HTMLCanvasElement>(null);

  // Engine Refs
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const trackerRef = useRef<SmoothingTracker>(new SmoothingTracker());
  const threeRendererRef = useRef<ThreeGlassesRenderer | null>(null);
  const photoThreeRendererRef = useRef<ThreeGlassesRenderer | null>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Photo Mode State
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);

  // Snapshot Result State
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  // Filtering & Facing Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [shapeFilter, setShapeFilter] = useState<string>("all");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Sample Preset Models for instant photo try-on
  const sampleModels = [
    {
      name: "Sophia (Oval)",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Marcus (Square)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Amara (Heart)",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "David (Round)",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    },
  ];

  // Sync initial product change
  useEffect(() => {
    if (initialProductId) {
      const found = products.find((p) => p.id === initialProductId);
      if (found) setCurrentProduct(found);
    }
  }, [initialProductId, products]);

  const currentColorOption: ColorOption =
    currentProduct.colors?.[selectedColorIndex] || {
      name: "Default",
      hex: "#111111",
    };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose();
        threeRendererRef.current = null;
      }
      if (photoThreeRendererRef.current) {
        photoThreeRendererRef.current.dispose();
        photoThreeRendererRef.current = null;
      }
    };
  }, []);

  // Initialize Three.js WebGL Renderer for camera mode
  useEffect(() => {
    if (cameraState === "active" && threeCanvasRef.current) {
      if (!threeRendererRef.current) {
        threeRendererRef.current = new ThreeGlassesRenderer({
          canvas: threeCanvasRef.current,
        });
      }
      // Load selected product 3D model
      threeRendererRef.current.loadProductModel(
        currentProduct,
        currentColorOption.hex,
        setIsLoading3dModel
      );
    }
  }, [cameraState, threeCanvasRef.current]);

  // Product or Color change handler (Does NOT restart camera or face tracker!)
  useEffect(() => {
    if (threeRendererRef.current && cameraState === "active") {
      threeRendererRef.current.loadProductModel(
        currentProduct,
        currentColorOption.hex,
        setIsLoading3dModel
      );
    }
  }, [currentProduct, selectedColorIndex, cameraState]);

  // Main AR Real-Time Camera & 3D WebGL Tracking Loop
  useEffect(() => {
    if (!cameraStream || cameraState !== "active") return;

    let isCancelled = false;
    let landmarker: any = null;

    const runArLoop = async () => {
      landmarker = await getFaceLandmarker();
      if (isCancelled) return;

      const video = videoRef.current;
      const vCanvas = videoCanvasRef.current;
      const tCanvas = threeCanvasRef.current;
      if (!video || !vCanvas || !tCanvas) return;

      const vCtx = vCanvas.getContext("2d");
      if (!vCtx) return;

      let detectedTimeout: NodeJS.Timeout | null = null;

      const loop = () => {
        if (isCancelled) return;

        if (video.readyState >= 2) {
          const w = video.videoWidth || 1280;
          const h = video.videoHeight || 720;

          // Adjust 2D & 3D canvas dimensions
          if (vCanvas.width !== w || vCanvas.height !== h) {
            vCanvas.width = w;
            vCanvas.height = h;
          }
          if (tCanvas.width !== w || tCanvas.height !== h) {
            tCanvas.width = w;
            tCanvas.height = h;
            if (threeRendererRef.current) {
              threeRendererRef.current.resize(w, h);
            }
          }

          // 1. Render Video Feed Mirrored on 2D Video Canvas
          vCtx.save();
          vCtx.scale(-1, 1);
          vCtx.drawImage(video, -w, 0, w, h);
          vCtx.restore();

          // 2. Perform MediaPipe Face Landmark Detection
          let rawTransform = null;
          if (landmarker) {
            try {
              const results = landmarker.detectForVideo(video, performance.now());
              if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                // Select face closest to center
                let primaryFaceIndex = 0;
                if (results.faceLandmarks.length > 1) {
                  let minDistance = Infinity;
                  results.faceLandmarks.forEach((faceLms: any[], idx: number) => {
                    const nose = faceLms[6] || faceLms[1];
                    const dist = Math.hypot(nose.x - 0.5, nose.y - 0.5);
                    if (dist < minDistance) {
                      minDistance = dist;
                      primaryFaceIndex = idx;
                    }
                  });
                }

                const landmarks = results.faceLandmarks[primaryFaceIndex];
                const calib = currentProduct.tryOnCalibration || DEFAULT_CALIBRATION;

                rawTransform = calculateLandmarkTransform(
                  landmarks,
                  w,
                  h,
                  calib,
                  true // Mirrored webcam
                );
              }
            } catch (e) {
              console.warn("Face detection tick issue:", e);
            }
          }

          // 3. Smooth Landmark Transformation
          const smooth = trackerRef.current.update(rawTransform);

          // Update Status UI
          if (smooth.trackingState === "tracking") {
            if (faceStatus !== "detected") {
              setFaceStatus("detected");
              setStatusText("Face & Eye Landmarks Locked ✓ Real 3D AR Active");
              if (!detectedTimeout) {
                detectedTimeout = setTimeout(() => {
                  setHideInstruction(true);
                }, 3000);
              }
            }
          } else if (smooth.trackingState === "holding") {
            setFaceStatus("holding");
            setStatusText("Adjust your position...");
          } else {
            setFaceStatus("searching");
            setStatusText("Finding your face & eye landmarks...");
            setHideInstruction(false);
          }

          // 4. Update 3D Glasses Pose in Three.js WebGL Layer
          if (threeRendererRef.current) {
            const calib = currentProduct.tryOnCalibration || DEFAULT_CALIBRATION;
            threeRendererRef.current.updatePose(smooth, calib, true);
          }
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        if (detectedTimeout) clearTimeout(detectedTimeout);
      };
    };

    runArLoop();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [cameraStream, cameraState, currentProduct, selectedColorIndex]);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraState("requesting");
    setErrorMessage(null);
    setHideInstruction(false);
    trackerRef.current.reset();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState("error");
        setErrorMessage("Webcam access is not supported by your browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode,
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraStream(stream);
      setCameraState("loading");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setCameraState("active");
            })
            .catch(() => {
              setCameraState("active");
            });
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraState("error");
      setErrorMessage(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera access is disabled. Please enable camera permissions in your browser settings to use Virtual Try-On."
          : "Could not start camera stream. Please check browser settings."
      );
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState("idle");
  };

  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => startCamera(), 200);
  };

  // Photo Try-On Handler
  const processPhotoTryOn = async (imageUrl: string) => {
    setUploadedPhotoUrl(imageUrl);
    setCameraState("photo");
    stopCamera();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = async () => {
      uploadedImageRef.current = img;
      renderPhoto3DOverlay(img);
    };
  };

  const renderPhoto3DOverlay = async (img: HTMLImageElement) => {
    const pCanvas = photoCanvasRef.current;
    const ptCanvas = photoThreeCanvasRef.current;
    if (!pCanvas || !ptCanvas) return;

    const ctx = pCanvas.getContext("2d");
    if (!ctx) return;

    const w = img.naturalWidth || 800;
    const h = img.naturalHeight || 800;
    pCanvas.width = w;
    pCanvas.height = h;
    ptCanvas.width = w;
    ptCanvas.height = h;

    ctx.drawImage(img, 0, 0, w, h);

    // Initialize photo Three.js renderer
    if (!photoThreeRendererRef.current) {
      photoThreeRendererRef.current = new ThreeGlassesRenderer({ canvas: ptCanvas });
    } else {
      photoThreeRendererRef.current.resize(w, h);
    }

    await photoThreeRendererRef.current.loadProductModel(
      currentProduct,
      currentColorOption.hex
    );

    // Detect landmarks on photo
    const landmarker = await getFaceLandmarker();
    if (landmarker) {
      try {
        const results = landmarker.detect(img);
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const landmarks = results.faceLandmarks[0];
          const calib = currentProduct.tryOnCalibration || DEFAULT_CALIBRATION;
          const raw = calculateLandmarkTransform(landmarks, w, h, calib, false);

          const tracker = new SmoothingTracker();
          const smooth = tracker.update(raw);

          photoThreeRendererRef.current.updatePose(smooth, calib, false);
        }
      } catch (e) {
        console.warn("Photo detection issue:", e);
      }
    }
  };

  // Re-render photo if product changes in photo mode
  useEffect(() => {
    if (cameraState === "photo" && uploadedImageRef.current) {
      renderPhoto3DOverlay(uploadedImageRef.current);
    }
  }, [currentProduct, selectedColorIndex, cameraState]);

  // Capture Snapshot (Combines live video/photo feed + 3D WebGL glasses canvas)
  const captureSnapshot = () => {
    let sourceVideoCanvas = videoCanvasRef.current;
    let sourceThreeCanvas = threeCanvasRef.current;

    if (cameraState === "photo") {
      sourceVideoCanvas = photoCanvasRef.current;
      sourceThreeCanvas = photoThreeCanvasRef.current;
    }

    if (!sourceVideoCanvas || !sourceThreeCanvas) return;

    const w = sourceVideoCanvas.width;
    const h = sourceVideoCanvas.height;

    // Create composite offscreen canvas
    const compositeCanvas = document.createElement("canvas");
    compositeCanvas.width = w;
    compositeCanvas.height = h;

    const cCtx = compositeCanvas.getContext("2d");
    if (!cCtx) return;

    // 1. Draw camera video / photo layer
    cCtx.drawImage(sourceVideoCanvas, 0, 0, w, h);

    // 2. Draw 3D WebGL glasses layer over video
    cCtx.drawImage(sourceThreeCanvas, 0, 0, w, h);

    const snapshotDataUrl = compositeCanvas.toDataURL("image/png");
    setCapturedSnapshot(snapshotDataUrl);
    setCameraState("result");

    showNotification("3D AR snapshot captured successfully!", "info");
  };

  const filteredProducts = products.filter((p) => {
    if (p.category === "contacts") return false;
    if (shapeFilter !== "all" && p.frameShape !== shapeFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={`relative w-full ${isModal ? "bg-neutral-950 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800" : "min-h-screen bg-neutral-950 text-white"}`}>
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 z-30">
        <div className="flex items-center space-x-3">
          {isModal ? (
            <button
              onClick={onCloseModal}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              title="Close Virtual Try-On"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveView({ type: "home" })}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              title="Back to Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 flex items-center space-x-1">
                <Box className="w-3 h-3" />
                <span>3D AR Glasses</span>
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                ILens Real 3D Try-On
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Three.js WebGL Real-Time Geometry & Head Pose Tracking
            </p>
          </div>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Developer 3D Calibration Mode Button */}
          <button
            onClick={() => setActiveView({ type: "try-on-calibration", productId: currentProduct.id })}
            className="px-2.5 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg flex items-center space-x-1.5 transition border border-amber-500/20"
            title="Open 3D Developer Calibration View"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">3D Calibration</span>
          </button>

          {cameraState === "active" && (
            <button
              onClick={toggleFacingMode}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition"
              title="Flip Camera"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          {(cameraState === "active" || cameraState === "photo") && (
            <button
              onClick={captureSnapshot}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[70vh] bg-neutral-950 flex items-center justify-center overflow-hidden">
        {/* Hidden Video Stream Element */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* STATE 1: IDLE / PERMISSION INTRO */}
        {cameraState === "idle" && (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400 animate-pulse">
              <Box className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live 3D Eyewear AR Mirror</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Camera access lets ILens place eyewear on your face for virtual try-on using MediaPipe landmark tracking & Three.js 3D WebGL.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
              <button
                onClick={startCamera}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enable Live Camera</span>
              </button>

              <label className="flex-1 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition border border-neutral-700">
                <Upload className="w-4 h-4 text-neutral-400" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const url = URL.createObjectURL(file);
                      processPhotoTryOn(url);
                    }
                  }}
                />
              </label>
            </div>

            {/* Quick Sample Models */}
            <div className="w-full pt-3 border-t border-neutral-800/80">
              <p className="text-[11px] text-neutral-400 mb-2">Or try on instant model presets:</p>
              <div className="grid grid-cols-4 gap-2">
                {sampleModels.map((model, idx) => (
                  <button
                    key={idx}
                    onClick={() => processPhotoTryOn(model.image)}
                    className="group relative rounded-lg overflow-hidden border border-neutral-800 hover:border-amber-400/50 transition aspect-square"
                  >
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 p-1 text-[9px] text-center font-medium truncate">
                      {model.name.split(" ")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: LOADING CAMERA STREAM */}
        {(cameraState === "requesting" || cameraState === "loading") && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Initializing AI Camera Stream</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Starting MediaPipe Face Landmarker & Three.js WebGL Engine...
              </p>
            </div>
          </div>
        )}

        {/* STATE 3: LIVE CAMERA + 3D WEBGL OVERLAY */}
        {(cameraState === "active" || cameraStream) && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 1. Mirrored 2D Video Feed Canvas */}
            <canvas ref={videoCanvasRef} className="w-full h-full object-contain" />

            {/* 2. Transparent Three.js 3D WebGL Canvas Overlay */}
            <canvas
              ref={threeCanvasRef}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            />

            {/* Loading 3D Model Badge */}
            {isLoading3dModel && (
              <div className="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 flex items-center space-x-2 text-xs text-amber-300 z-20">
                <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Loading 3D Frame Model...</span>
              </div>
            )}

            {/* Tracking Status Feedback */}
            {!hideInstruction && (
              <div className="absolute top-4 inset-x-0 mx-auto w-max max-w-[90%] bg-neutral-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 flex items-center space-x-2 text-xs shadow-xl z-20">
                <span
                  className={`w-2 h-2 rounded-full ${
                    faceStatus === "detected"
                      ? "bg-green-400 animate-pulse"
                      : faceStatus === "holding"
                      ? "bg-amber-400"
                      : "bg-neutral-500"
                  }`}
                />
                <span className="text-neutral-200 font-medium">{statusText}</span>
              </div>
            )}
          </div>
        )}

        {/* STATE 4: PHOTO 3D TRY-ON CANVAS */}
        {cameraState === "photo" && (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <canvas ref={photoCanvasRef} className="max-w-full max-h-full object-contain rounded-xl" />
            <canvas
              ref={photoThreeCanvasRef}
              className="absolute inset-0 max-w-full max-h-full object-contain pointer-events-none rounded-xl z-10"
            />

            <button
              onClick={() => {
                setCameraState("idle");
                setUploadedPhotoUrl(null);
              }}
              className="absolute top-4 left-4 p-2 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-full border border-neutral-700 backdrop-blur-md transition z-20"
              title="Change Photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STATE 5: CAPTURED SNAPSHOT RESULT SCREEN */}
        {cameraState === "result" && capturedSnapshot && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-950">
            <img
              src={capturedSnapshot}
              alt="Virtual Try-On Snapshot"
              className="max-h-[75%] rounded-xl border border-neutral-800 shadow-2xl object-contain"
            />

            <div className="flex items-center space-x-3 mt-4">
              <a
                href={capturedSnapshot}
                download={`ILens-3D-${currentProduct.name}-TryOn.png`}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl flex items-center space-x-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Save 3D Photo</span>
              </a>

              <button
                onClick={() => setCameraState("active")}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl flex items-center space-x-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        )}

        {/* CAMERA ERROR DISPLAY */}
        {cameraState === "error" && (
          <div className="p-6 text-center max-w-md space-y-3">
            <Shield className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Camera Access Error</h3>
            <p className="text-xs text-neutral-400">{errorMessage}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom Product Selection & Customizer Bar */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-4 space-y-4">
        {/* Active Frame Details & E-Commerce Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 p-1 border border-neutral-700 flex items-center justify-center shrink-0">
              <img
                src={currentProduct.primaryImage}
                alt={currentProduct.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">{currentProduct.name}</h3>
                <span className="text-xs font-semibold text-amber-400">
                  ${currentProduct.price}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {currentProduct.brand} • {currentProduct.frameShape}
              </p>
            </div>
          </div>

          {/* Color Option Swatches (Recolors 3D Frame in real-time) */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-400 mr-1">Frame Color:</span>
            {currentProduct.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  selectedColorIndex === idx
                    ? "border-amber-400 scale-110 ring-2 ring-amber-500/30"
                    : "border-neutral-700 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* E-Commerce Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleWishlist(currentProduct)}
              className={`p-2.5 rounded-xl border transition ${
                isInWishlist(currentProduct.id)
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(currentProduct.id) ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={() => openLensCustomizer(currentProduct)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 transition"
            >
              Select Lenses
            </button>

            <button
              onClick={() => {
                addToCart(currentProduct, currentProduct.colors[selectedColorIndex]);
                showNotification(`Added ${currentProduct.name} to cart!`, "success");
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Frame Carousel Selector */}
        <div className="pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Try Other 3D Frames</span>
            </span>

            {/* Frame Shape Filters */}
            <div className="flex items-center space-x-1 text-xs overflow-x-auto pb-1 scrollbar-none">
              {["all", "geometric", "cat-eye", "round", "square", "aviator", "wayfarer", "rectangle"].map((shape) => (
                <button
                  key={shape}
                  onClick={() => setShapeFilter(shape)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition text-[11px] shrink-0 ${
                    shapeFilter === shape
                      ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setCurrentProduct(product);
                  setSelectedColorIndex(0);
                }}
                className={`shrink-0 w-36 bg-neutral-950 p-2.5 rounded-xl border text-left transition ${
                  currentProduct.id === product.id
                    ? "border-amber-500 bg-neutral-800/50 ring-1 ring-amber-500/50"
                    : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="h-16 w-full flex items-center justify-center mb-1.5 relative">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-0 right-0 bg-neutral-800/80 text-[9px] text-amber-300 px-1 py-0.5 rounded font-mono border border-neutral-700">
                    3D
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">{product.name}</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5">
                  <span className="capitalize">{product.frameShape}</span>
                  <span className="font-semibold text-amber-400">${product.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
