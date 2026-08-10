import { FaceLandmarker, FilesetResolver, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { TryOnCalibration } from "../types";

export interface SmoothedTransform {
  x: number; // Pixels
  y: number; // Pixels
  scale: number; // Scale factor
  width: number; // Pixels
  height: number; // Pixels
  rotationDeg: number; // Angle in degrees
  yawDeg: number; // Head turn angle
  pitchDeg: number; // Head pitch
  opacity: number; // 0 to 1 for smooth fade
  trackingState: "tracking" | "holding" | "lost";
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    noseBridge: { x: number; y: number };
    faceCenter: { x: number; y: number };
    eyeDistancePx: number;
    eyeAngleDeg: number;
  };
}

// Default calibration fallback if none specified
export const DEFAULT_CALIBRATION: TryOnCalibration = {
  scale: 1.0,
  xOffset: 0.0,
  yOffset: 0.0,
  zOffset: 0.0,
  rotationX: 0.0,
  rotationY: 0.0,
  rotationZ: 0.0,
  eyeDistanceFactor: 1.0,
  noseBridgeOffset: 0.15,
  widthRatio: 2.2,
  verticalOffset: -0.02,
  horizontalOffset: 0.0,
  rotationOffset: 0.0,
};

let landmarkerInstance: FaceLandmarker | null = null;
let landmarkerLoadingPromise: Promise<FaceLandmarker | null> | null = null;

/**
 * Initializes and caches the MediaPipe FaceLandmarker instance
 */
export async function getFaceLandmarker(): Promise<FaceLandmarker | null> {
  if (landmarkerInstance) return landmarkerInstance;
  if (landmarkerLoadingPromise) return landmarkerLoadingPromise;

  landmarkerLoadingPromise = (async () => {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFacialTransformationMatrixes: true,
      });

      landmarkerInstance = landmarker;
      return landmarker;
    } catch (err) {
      console.warn("Failed to load MediaPipe FaceLandmarker with GPU, trying CPU fallback...", err);
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFacialTransformationMatrixes: true,
        });
        landmarkerInstance = landmarker;
        return landmarker;
      } catch (fallbackErr) {
        console.error("MediaPipe FaceLandmarker initialization error:", fallbackErr);
        return null;
      }
    }
  })();

  return landmarkerLoadingPromise;
}

/**
 * Calculates raw AR glasses transform coordinates from 478 MediaPipe face landmarks
 */
export function calculateLandmarkTransform(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  calibration: TryOnCalibration = DEFAULT_CALIBRATION,
  isMirrored: boolean = true
): {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
  rotationDeg: number;
  yawDeg: number;
  pitchDeg: number;
  landmarksData: NonNullable<SmoothedTransform["landmarks"]>;
} {
  // Map normalized keypoint (0-1) to canvas pixels
  const mapPt = (pt: NormalizedLandmark) => {
    let x = pt.x * canvasWidth;
    if (isMirrored) {
      x = (1 - pt.x) * canvasWidth;
    }
    const y = pt.y * canvasHeight;
    return { x, y, z: pt.z };
  };

  // Left eye corners (33 outer, 133 inner) for blinking stability
  const leftOuter = mapPt(landmarks[33]);
  const leftInner = mapPt(landmarks[133]);
  const leftEyeCenter = {
    x: (leftOuter.x + leftInner.x) / 2,
    y: (leftOuter.y + leftInner.y) / 2,
  };

  // Right eye corners (362 inner, 263 outer)
  const rightInner = mapPt(landmarks[362]);
  const rightOuter = mapPt(landmarks[263]);
  const rightEyeCenter = {
    x: (rightInner.x + rightOuter.x) / 2,
    y: (rightInner.y + rightOuter.y) / 2,
  };

  // Nose bridge / Nasion (landmark 6 or 168)
  const noseBridgePt = mapPt(landmarks[6] || landmarks[168]);

  // Cheeks / face tragus for yaw calculation (234 left, 454 right)
  const leftCheek = mapPt(landmarks[234]);
  const rightCheek = mapPt(landmarks[454]);

  // Face Center
  const faceCenter = {
    x: (leftCheek.x + rightCheek.x) / 2,
    y: (leftEyeCenter.y + rightEyeCenter.y + noseBridgePt.y) / 3,
  };

  // Eye distance in pixels
  // Note: if mirrored, rightEye is visually on left or vice versa depending on mapping
  const dx = rightEyeCenter.x - leftEyeCenter.x;
  const dy = rightEyeCenter.y - leftEyeCenter.y;
  const eyeDistancePx = Math.hypot(dx, dy);

  // Eye line angle (Roll / Head Tilt in degrees)
  const eyeAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

  // Midpoint between eyes
  const eyeMidpoint = {
    x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
    y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
  };

  // Calculate glasses anchor center (eye line midpoint + shift towards nose bridge)
  const noseWeight = calibration.noseBridgeOffset ?? 0.15;
  const rawX = eyeMidpoint.x + (noseBridgePt.x - eyeMidpoint.x) * noseWeight + (calibration.horizontalOffset || 0) * canvasWidth;
  const rawY = eyeMidpoint.y + (noseBridgePt.y - eyeMidpoint.y) * noseWeight + (calibration.verticalOffset || 0) * canvasHeight;

  // Frame width based on eye distance & calibration ratio
  const ratio = calibration.widthRatio || 2.2;
  const frameWidth = eyeDistancePx * ratio;
  const frameHeight = frameWidth * 0.4; // Typical glasses aspect ratio ~ 2.5:1

  // Head yaw estimate (left vs right cheek distance to nose)
  const leftDist = Math.hypot(noseBridgePt.x - leftCheek.x, noseBridgePt.y - leftCheek.y);
  const rightDist = Math.hypot(noseBridgePt.x - rightCheek.x, noseBridgePt.y - rightCheek.y);
  const yawDeg = ((rightDist - leftDist) / (leftDist + rightDist)) * 45;

  // Head pitch estimate
  const pitchDeg = ((noseBridgePt.y - eyeMidpoint.y) / eyeDistancePx - 0.2) * 30;

  const totalRotation = eyeAngleDeg + (calibration.rotationOffset || 0);

  return {
    x: rawX,
    y: rawY,
    scale: 1.0,
    width: frameWidth,
    height: frameHeight,
    rotationDeg: totalRotation,
    yawDeg,
    pitchDeg,
    landmarksData: {
      leftEye: leftEyeCenter,
      rightEye: rightEyeCenter,
      noseBridge: noseBridgePt,
      faceCenter,
      eyeDistancePx,
      eyeAngleDeg,
    },
  };
}

/**
 * Class to manage stateful low-pass smoothing, face-loss decay, and re-acquisition
 */
export class SmoothingTracker {
  private prevTransform: SmoothedTransform | null = null;
  private lastDetectedTimestamp: number = 0;
  private smoothingAlphaPosition = 0.35; // Responsive position smoothing
  private smoothingAlphaScale = 0.25; // Smooth scale transitions
  private smoothingAlphaAngle = 0.30; // Smooth rotation

  public reset() {
    this.prevTransform = null;
    this.lastDetectedTimestamp = 0;
  }

  public update(
    rawTransform: ReturnType<typeof calculateLandmarkTransform> | null,
    now: number = Date.now()
  ): SmoothedTransform {
    if (rawTransform) {
      this.lastDetectedTimestamp = now;

      if (!this.prevTransform || this.prevTransform.trackingState === "lost") {
        // Initial detection or re-acquisition
        const newTransform: SmoothedTransform = {
          x: rawTransform.x,
          y: rawTransform.y,
          scale: rawTransform.scale,
          width: rawTransform.width,
          height: rawTransform.height,
          rotationDeg: rawTransform.rotationDeg,
          yawDeg: rawTransform.yawDeg,
          pitchDeg: rawTransform.pitchDeg,
          opacity: 1.0,
          trackingState: "tracking",
          landmarks: rawTransform.landmarksData,
        };
        this.prevTransform = newTransform;
        return newTransform;
      }

      // Exponential Moving Average (EMA) Low-Pass Filter
      const prev = this.prevTransform;

      // Handle angle wrap-around (-180 to +180)
      let angleDiff = rawTransform.rotationDeg - prev.rotationDeg;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      const smoothX = prev.x + (rawTransform.x - prev.x) * this.smoothingAlphaPosition;
      const smoothY = prev.y + (rawTransform.y - prev.y) * this.smoothingAlphaPosition;
      const smoothWidth = prev.width + (rawTransform.width - prev.width) * this.smoothingAlphaScale;
      const smoothHeight = prev.height + (rawTransform.height - prev.height) * this.smoothingAlphaScale;
      const smoothRotation = prev.rotationDeg + angleDiff * this.smoothingAlphaAngle;
      const smoothYaw = prev.yawDeg + (rawTransform.yawDeg - prev.yawDeg) * 0.25;
      const smoothPitch = prev.pitchDeg + (rawTransform.pitchDeg - prev.pitchDeg) * 0.25;

      const updated: SmoothedTransform = {
        x: smoothX,
        y: smoothY,
        scale: 1.0,
        width: smoothWidth,
        height: smoothHeight,
        rotationDeg: smoothRotation,
        yawDeg: smoothYaw,
        pitchDeg: smoothPitch,
        opacity: Math.min(1.0, prev.opacity + 0.1), // Fade in if previously holding
        trackingState: "tracking",
        landmarks: rawTransform.landmarksData,
      };

      this.prevTransform = updated;
      return updated;
    }

    // Face missing case (Face Loss / Occlusion handling - Rules 14 & 15)
    if (this.prevTransform) {
      const elapsedSinceLoss = now - this.lastDetectedTimestamp;

      if (elapsedSinceLoss < 1000) {
        // Hold last stable tracking state briefly
        return {
          ...this.prevTransform,
          trackingState: "holding",
          opacity: 0.9,
        };
      } else if (elapsedSinceLoss < 2000) {
        // Smoothly fade out glasses overlay
        const fadeRatio = 1 - (elapsedSinceLoss - 1000) / 1000;
        return {
          ...this.prevTransform,
          trackingState: "holding",
          opacity: Math.max(0, fadeRatio),
        };
      }
    }

    // Fully lost state
    const lostState: SmoothedTransform = {
      x: 0,
      y: 0,
      scale: 1.0,
      width: 0,
      height: 0,
      rotationDeg: 0,
      yawDeg: 0,
      pitchDeg: 0,
      opacity: 0,
      trackingState: "lost",
    };
    this.prevTransform = lostState;
    return lostState;
  }
}
