import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Product, TryOnCalibration } from "../types";
import { getFaceLandmarker, calculateLandmarkTransform, DEFAULT_CALIBRATION, SmoothingTracker } from "../lib/arFaceTracker";
import { ThreeGlassesRenderer } from "../lib/threeGlassesRenderer";
import { ArrowLeft, Save, RotateCcw, Copy, Check, Eye, Sliders, Shield, Sparkles, Box, Settings2, Layers } from "lucide-react";

interface TryOnCalibrationViewProps {
  productId?: string;
  onBack?: () => void;
}

export const TryOnCalibrationView: React.FC<TryOnCalibrationViewProps> = ({
  productId,
  onBack,
}) => {
  const { products, setActiveView, showNotification } = useApp();
  const selectedProduct =
    products.find((p) => p.id === productId) ||
    products.find((p) => p.category !== "contacts") ||
    products[0];

  const [calibration, setCalibration] = useState<TryOnCalibration>(
    selectedProduct.tryOnCalibration || { ...DEFAULT_CALIBRATION }
  );

  const [cameraState, setCameraState] = useState<"initializing" | "active" | "error">("initializing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAxes, setShowAxes] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const trackerRef = useRef<SmoothingTracker>(new SmoothingTracker());
  const threeRendererRef = useRef<ThreeGlassesRenderer | null>(null);

  // Sync calibration when product changes
  useEffect(() => {
    if (selectedProduct.tryOnCalibration) {
      setCalibration({ ...selectedProduct.tryOnCalibration });
    } else {
      setCalibration({ ...DEFAULT_CALIBRATION });
    }
  }, [selectedProduct.id]);

  // Initialize Three.js WebGL Renderer
  useEffect(() => {
    if (cameraState === "active" && threeCanvasRef.current) {
      if (!threeRendererRef.current) {
        threeRendererRef.current = new ThreeGlassesRenderer({
          canvas: threeCanvasRef.current,
          showAxes: showAxes,
        });
      }
      threeRendererRef.current.enableAxesHelper(showAxes);
      threeRendererRef.current.loadProductModel(
        selectedProduct,
        selectedProduct.colors[0]?.hex || "#111111"
      );
    }
  }, [cameraState, showAxes, selectedProduct]);

  // Update Axis Helper visibility when toggled
  useEffect(() => {
    if (threeRendererRef.current) {
      threeRendererRef.current.enableAxesHelper(showAxes);
    }
  }, [showAxes]);

  // Camera & Face Mesh Tracking
  useEffect(() => {
    let isCancelled = false;

    const startCameraAndTracker = async () => {
      try {
        setCameraState("initializing");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const landmarker = await getFaceLandmarker();
        if (isCancelled) return;

        setCameraState("active");

        const renderLoop = () => {
          if (isCancelled) return;

          const video = videoRef.current;
          const vCanvas = videoCanvasRef.current;
          const tCanvas = threeCanvasRef.current;

          if (video && vCanvas && tCanvas && video.readyState >= 2) {
            const w = video.videoWidth || 1280;
            const h = video.videoHeight || 720;

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

            const ctx = vCanvas.getContext("2d");
            if (ctx) {
              // Draw video frame (mirrored)
              ctx.save();
              ctx.scale(-1, 1);
              ctx.drawImage(video, -w, 0, w, h);
              ctx.restore();
            }

            // Run landmark detection
            let rawTransform = null;
            if (landmarker) {
              try {
                const results = landmarker.detectForVideo(video, performance.now());
                if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                  const landmarks = results.faceLandmarks[0];
                  rawTransform = calculateLandmarkTransform(
                    landmarks,
                    w,
                    h,
                    calibration,
                    true
                  );
                }
              } catch (e) {
                console.warn("Calibration detection tick error:", e);
              }
            }

            // Smooth & update 3D WebGL pose
            const smooth = trackerRef.current.update(rawTransform);
            if (threeRendererRef.current) {
              threeRendererRef.current.updatePose(smooth, calibration, true);
            }
          }

          animationFrameRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop();
      } catch (err: any) {
        console.error("Calibration camera error:", err);
        setCameraState("error");
        setErrorMessage("Could not access camera stream. Please grant camera permission.");
      }
    };

    startCameraAndTracker();

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose();
        threeRendererRef.current = null;
      }
    };
  }, [calibration, selectedProduct.id]);

  const handleReset = () => {
    setCalibration({ ...DEFAULT_CALIBRATION });
  };

  const handleCopyConfig = () => {
    const jsonStr = JSON.stringify(calibration, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProductCalibration = () => {
    selectedProduct.tryOnCalibration = { ...calibration };
    setSavedSuccess(true);
    showNotification(`Saved 3D AR Calibration for ${selectedProduct.name}`, "success");
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (onBack ? onBack() : setActiveView({ type: "try-on", productId: selectedProduct.id }))}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                Dev Tool
              </span>
              <h1 className="text-lg font-bold text-white">3D AR Eyewear Calibration</h1>
            </div>
            <p className="text-xs text-neutral-400">
              Calibrate 3D GLB position, depth, pitch/yaw/roll rotations, and scale multipliers
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAxes(!showAxes)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              showAxes
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-neutral-800 text-neutral-400 border-neutral-700"
            }`}
          >
            {showAxes ? "Axes: ON (RGB)" : "Axes: OFF"}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopyConfig}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied JSON" : "Copy JSON"}</span>
          </button>

          <button
            onClick={handleSaveProductCalibration}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? "Saved!" : "Save Calibration"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left: 3D Camera & WebGL Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-neutral-900 rounded-2xl border border-neutral-800 p-4 relative overflow-hidden">
          <video ref={videoRef} playsInline muted className="hidden" />

          <div className="relative w-full aspect-[4/3] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
            {cameraState === "initializing" && (
              <div className="text-center p-6 space-y-3">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-neutral-400">Loading camera & 3D WebGL engine...</p>
              </div>
            )}

            {cameraState === "error" && (
              <div className="text-center p-6 space-y-3">
                <Shield className="w-10 h-10 text-red-400 mx-auto" />
                <p className="text-xs text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* 1. Mirrored Video Canvas */}
            <canvas ref={videoCanvasRef} className="w-full h-full object-contain" />

            {/* 2. Three.js WebGL Canvas Overlay */}
            <canvas
              ref={threeCanvasRef}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            />
          </div>

          <div className="w-full mt-4 flex items-center justify-between text-xs text-neutral-400 px-2">
            <span className="flex items-center space-x-1.5">
              <Box className="w-4 h-4 text-amber-400" />
              <span>
                Active Model: <strong className="text-white">{selectedProduct.name}</strong> ({selectedProduct.frameShape})
              </span>
            </span>
            <span className="font-mono text-[11px] text-amber-400/80">
              Red=X Axis | Green=Y Axis | Blue=Z Depth
            </span>
          </div>
        </div>

        {/* Right: 3D Calibration Control Sliders */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[80vh]">
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>3D Geometry Fine-Tuning</span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* 3D Scale Slider */}
              <div className="space-y-1 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-300">3D Model Scale:</span>
                  <span className="text-amber-400 font-mono">{calibration.scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={calibration.scale}
                  onChange={(e) => setCalibration({ ...calibration, scale: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Position Offsets (X, Y, Z Depth) */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-3">
                <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                  Position Shift (X, Y, Z Depth)
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">X Offset (Horizontal):</span>
                    <span className="text-amber-400 font-mono">{calibration.xOffset.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5.0"
                    max="5.0"
                    step="0.1"
                    value={calibration.xOffset}
                    onChange={(e) => setCalibration({ ...calibration, xOffset: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">Y Offset (Vertical):</span>
                    <span className="text-amber-400 font-mono">{calibration.yOffset.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5.0"
                    max="5.0"
                    step="0.1"
                    value={calibration.yOffset}
                    onChange={(e) => setCalibration({ ...calibration, yOffset: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">Z Depth Offset (Forward/Back):</span>
                    <span className="text-amber-400 font-mono">{calibration.zOffset.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5.0"
                    max="5.0"
                    step="0.1"
                    value={calibration.zOffset}
                    onChange={(e) => setCalibration({ ...calibration, zOffset: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Rotations (Pitch X, Yaw Y, Roll Z) */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-3">
                <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                  Rotation Angles (Degrees)
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">Pitch (Tilt Up / Down):</span>
                    <span className="text-amber-400 font-mono">{calibration.rotationX.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={calibration.rotationX}
                    onChange={(e) => setCalibration({ ...calibration, rotationX: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">Yaw (Turn Left / Right):</span>
                    <span className="text-amber-400 font-mono">{calibration.rotationY.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={calibration.rotationY}
                    onChange={(e) => setCalibration({ ...calibration, rotationY: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-300">Roll (Tilt Sideways):</span>
                    <span className="text-amber-400 font-mono">{calibration.rotationZ.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={calibration.rotationZ}
                    onChange={(e) => setCalibration({ ...calibration, rotationZ: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generated Calibration Object Preview */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-400">
            <p className="text-neutral-300 font-sans font-semibold mb-1">Generated JSON Config:</p>
            <pre className="text-amber-300/90 overflow-x-auto p-2 bg-neutral-900 rounded-lg">
              {JSON.stringify(calibration, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
