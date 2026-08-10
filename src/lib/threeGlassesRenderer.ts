import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Product, TryOnCalibration, FrameShape } from "../types";
import { SmoothedTransform } from "./arFaceTracker";

export interface ThreeGlassesRendererOptions {
  canvas: HTMLCanvasElement;
  showAxes?: boolean;
}

export class ThreeGlassesRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Model hierarchy
  private wrapperGroup: THREE.Group; // Animated via tracking
  private calibrationGroup: THREE.Group; // Fine-tune calibration offsets
  private currentModelGroup: THREE.Group | null = null;
  private axesHelper: THREE.AxesHelper | null = null;

  // Loading & State
  private loader: GLTFLoader;
  private isLoadingModel = false;
  private currentModelPath: string | null = null;
  private frameMaterials: THREE.MeshStandardMaterial[] = [];
  private lensMaterials: THREE.MeshPhysicalMaterial[] = [];

  constructor(options: ThreeGlassesRendererOptions) {
    this.canvas = options.canvas;

    // 1. Initialize WebGL Renderer with Alpha transparency and drawing buffer preservation for capture
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvas.width || 1280, this.canvas.height || 720, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Scene Setup
    this.scene = new THREE.Scene();

    // 3. Camera Setup (FOV: 45deg, distance calibrated so 1 unit = 1 pixel at Z=0)
    const aspect = (this.canvas.width || 1280) / (this.canvas.height || 720);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 5000);
    this.setupCameraDistance();

    // 4. Lighting Setup for Realistic Materials
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0xffffff, 2.2);
    mainDirectional.position.set(200, 400, 500);
    this.scene.add(mainDirectional);

    const fillDirectional = new THREE.DirectionalLight(0xecfeff, 1.2);
    fillDirectional.position.set(-200, -100, 300);
    this.scene.add(fillDirectional);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 1.0);
    rimLight.position.set(0, 300, -300);
    this.scene.add(rimLight);

    // 5. Hierarchy Setup
    this.wrapperGroup = new THREE.Group();
    this.calibrationGroup = new THREE.Group();
    this.wrapperGroup.add(this.calibrationGroup);
    this.scene.add(this.wrapperGroup);

    // GLTF Loader
    this.loader = new GLTFLoader();

    // Axis Helper for Debug Calibration Mode
    if (options.showAxes) {
      this.enableAxesHelper(true);
    }
  }

  /**
   * Sets perspective camera distance so 3D units match canvas pixel coordinates at Z=0
   */
  private setupCameraDistance() {
    const height = this.canvas.height || 720;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const dist = height / 2 / Math.tan(fovRad / 2);
    this.camera.position.set(0, 0, dist);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Toggle 3D Axis Helper (Red=X, Green=Y, Blue=Z)
   */
  public enableAxesHelper(enable: boolean) {
    if (enable) {
      if (!this.axesHelper) {
        this.axesHelper = new THREE.AxesHelper(120);
        this.calibrationGroup.add(this.axesHelper);
      }
      this.axesHelper.visible = true;
    } else if (this.axesHelper) {
      this.axesHelper.visible = false;
    }
  }

  /**
   * Resize WebGL Viewport
   */
  public resize(width: number, height: number) {
    if (width === 0 || height === 0) return;
    this.canvas.width = width;
    this.canvas.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.setupCameraDistance();
  }

  /**
   * Loads or generates the 3D model for the given product
   */
  public async loadProductModel(
    product: Product,
    colorHex: string = "#111111",
    onLoadingStateChange?: (isLoading: boolean) => void
  ): Promise<void> {
    const modelPath = product.tryOnModel || `/models/${product.id}.glb`;

    // Avoid reloading if same model is requested
    if (this.currentModelPath === modelPath && this.currentModelGroup) {
      this.updateFrameColor(colorHex);
      return;
    }

    this.isLoadingModel = true;
    if (onLoadingStateChange) onLoadingStateChange(true);

    try {
      // Attempt to load .glb / .gltf
      const loadedGroup = await this.fetchGlbModel(modelPath);
      this.setCurrentModelGroup(loadedGroup, colorHex);
      this.currentModelPath = modelPath;
    } catch (err) {
      console.warn(`GLB model not found at ${modelPath}, generating procedural 3D model for shape: ${product.frameShape}`);
      // Fallback to high quality procedural 3D glasses model matching product shape
      const proceduralGroup = this.createProcedural3DGlasses(product.frameShape, product.category, colorHex);
      this.setCurrentModelGroup(proceduralGroup, colorHex);
      this.currentModelPath = `procedural-${product.frameShape}`;
    } finally {
      this.isLoadingModel = false;
      if (onLoadingStateChange) onLoadingStateChange(false);
    }
  }

  /**
   * Helper to fetch and normalize GLB / GLTF 3D model
   */
  private fetchGlbModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // Normalize model: Center origin at nose bridge & scale to standard 140mm width
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Center model at origin
          model.position.sub(center);

          // Standard width scaling (~140 units)
          if (size.x > 0) {
            const targetWidth = 140;
            const scaleFactor = targetWidth / size.x;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
          }

          const containerGroup = new THREE.Group();
          containerGroup.add(model);
          resolve(containerGroup);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  /**
   * Sets active model group in scene and extracts material references
   */
  private setCurrentModelGroup(group: THREE.Group, colorHex: string) {
    if (this.currentModelGroup) {
      this.calibrationGroup.remove(this.currentModelGroup);
      this.disposeGroup(this.currentModelGroup);
    }

    this.currentModelGroup = group;
    this.calibrationGroup.add(this.currentModelGroup);

    // Extract frame & lens materials
    this.frameMaterials = [];
    this.lensMaterials = [];

    this.currentModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;

        if (mesh.name.toLowerCase().includes("lens") || (mat.name && mat.name.toLowerCase().includes("lens"))) {
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            this.lensMaterials.push(mat);
          }
        } else if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
          this.frameMaterials.push(mat as THREE.MeshStandardMaterial);
        }
      }
    });

    this.updateFrameColor(colorHex);
  }

  /**
   * Updates frame material color dynamically without reloading model
   */
  public updateFrameColor(colorHex: string) {
    const targetColor = new THREE.Color(colorHex);

    if (this.currentModelGroup) {
      this.currentModelGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.userData.isFrameMesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.color) {
              mat.color.copy(targetColor);
            }
          }
        }
      });
    }

    this.frameMaterials.forEach((mat) => {
      if (mat && mat.color) {
        mat.color.copy(targetColor);
      }
    });
  }

  /**
   * Generates realistic 3D Glasses Geometry (Rims, 3D Nose Bridge, Nose Pads, 3D Temple Arms, 3D Glass Lenses)
   */
  private createProcedural3DGlasses(shape: FrameShape, category: string, colorHex: string): THREE.Group {
    const group = new THREE.Group();
    const isSunglasses = category === "sunglasses";
    const isBlueLight = category === "bluelight";

    // Colors
    const frameColor = new THREE.Color(colorHex);
    const lensColor = isSunglasses
      ? new THREE.Color("#1a202c")
      : isBlueLight
      ? new THREE.Color("#e0f2fe")
      : new THREE.Color("#f8fafc");

    // Frame Material with 3D Satin Metallic / Acetate finish
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: frameColor,
      metalness: 0.6,
      roughness: 0.25,
      envMapIntensity: 1.0,
    });

    // Glass Lens Material with Transmission & Refraction
    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: lensColor,
      transmission: isSunglasses ? 0.3 : 0.88,
      opacity: isSunglasses ? 0.85 : 0.45,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.5,
      thickness: 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Dimensions
    const eyeSpacing = 72; // Distance between lens centers in mm
    const lensWidth = 50;
    const lensHeight = shape === "aviator" ? 48 : shape === "cat-eye" ? 42 : shape === "round" ? 46 : 40;
    const rimDepth = 12; // 3D Frame Depth along Z axis

    // Helper to create 2D shape for rim profile
    const createLensShape = (w: number, h: number, fShape: FrameShape) => {
      const s = new THREE.Shape();
      const hw = w / 2;
      const hh = h / 2;

      if (fShape === "round") {
        s.absellipse(0, 0, hw, hh, 0, Math.PI * 2, false, 0);
      } else if (fShape === "cat-eye") {
        s.moveTo(-hw, -hh * 0.5);
        s.quadraticCurveTo(-hw, hh * 0.8, -hw * 0.2, hh);
        s.quadraticCurveTo(hw * 0.8, hh * 1.2, hw, hh * 0.8);
        s.quadraticCurveTo(hw, -hh * 0.5, 0, -hh);
        s.quadraticCurveTo(-hw, -hh, -hw, -hh * 0.5);
      } else if (fShape === "aviator") {
        s.moveTo(-hw, hh * 0.7);
        s.lineTo(hw, hh * 0.7);
        s.quadraticCurveTo(hw * 1.1, -hh * 0.3, hw * 0.5, -hh);
        s.quadraticCurveTo(0, -hh * 1.1, -hw * 0.5, -hh);
        s.quadraticCurveTo(-hw * 1.1, -hh * 0.3, -hw, hh * 0.7);
      } else if (fShape === "geometric") {
        const sides = 8;
        for (let i = 0; i < sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          const px = Math.cos(a) * hw;
          const py = Math.sin(a) * hh;
          if (i === 0) s.moveTo(px, py);
          else s.lineTo(px, py);
        }
      } else {
        // Square / Wayfarer / Rectangle
        const r = 8;
        s.moveTo(-hw + r, -hh);
        s.lineTo(hw - r, -hh);
        s.quadraticCurveTo(hw, -hh, hw, -hh + r);
        s.lineTo(hw, hh - r);
        s.quadraticCurveTo(hw, hh, hw - r, hh);
        s.lineTo(-hw + r, hh);
        s.quadraticCurveTo(-hw, hh, -hw, hh - r);
        s.lineTo(-hw, -hh + r);
        s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
      }
      return s;
    };

    const outerShape = createLensShape(lensWidth + 6, lensHeight + 6, shape);
    const innerHole = createLensShape(lensWidth, lensHeight, shape);
    outerShape.holes.push(innerHole);

    // Extrude Settings for 3D Rims
    const extrudeSettings = {
      depth: rimDepth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 1.5,
      bevelThickness: 1.5,
    };

    const rimGeo = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
    rimGeo.center();

    // 1. Left Rim Mesh
    const leftRim = new THREE.Mesh(rimGeo, frameMaterial);
    leftRim.position.set(-eyeSpacing / 2, 0, 0);
    leftRim.userData.isFrameMesh = true;
    group.add(leftRim);

    // 2. Right Rim Mesh
    const rightRim = new THREE.Mesh(rimGeo, frameMaterial);
    rightRim.position.set(eyeSpacing / 2, 0, 0);
    rightRim.userData.isFrameMesh = true;
    group.add(rightRim);

    // 3. 3D Glass Lenses
    const lensShape = createLensShape(lensWidth, lensHeight, shape);
    const lensGeo = new THREE.ShapeGeometry(lensShape);
    lensGeo.center();

    const leftLens = new THREE.Mesh(lensGeo, lensMaterial);
    leftLens.position.set(-eyeSpacing / 2, 0, rimDepth / 2);
    group.add(leftLens);

    const rightLens = new THREE.Mesh(lensGeo, lensMaterial);
    rightLens.position.set(eyeSpacing / 2, 0, rimDepth / 2);
    group.add(rightLens);

    // 4. 3D Nose Bridge
    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-eyeSpacing / 2 + lensWidth / 2 - 2, 2, rimDepth / 2),
      new THREE.Vector3(0, 6, rimDepth / 2 + 2),
      new THREE.Vector3(eyeSpacing / 2 - lensWidth / 2 + 2, 2, rimDepth / 2),
    ]);
    const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 16, 2.5, 8, false);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, frameMaterial);
    bridgeMesh.userData.isFrameMesh = true;
    group.add(bridgeMesh);

    // If aviator, add top double bridge
    if (shape === "aviator") {
      const topBridgeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-eyeSpacing / 2 + lensWidth / 2 - 2, lensHeight / 2 - 2, rimDepth / 2),
        new THREE.Vector3(0, lensHeight / 2, rimDepth / 2 + 1),
        new THREE.Vector3(eyeSpacing / 2 - lensWidth / 2 + 2, lensHeight / 2 - 2, rimDepth / 2),
      ]);
      const topBridgeGeo = new THREE.TubeGeometry(topBridgeCurve, 12, 1.8, 8, false);
      const topBridgeMesh = new THREE.Mesh(topBridgeGeo, frameMaterial);
      topBridgeMesh.userData.isFrameMesh = true;
      group.add(topBridgeMesh);
    }

    // 5. 3D Nose Pads
    const padGeo = new THREE.CylinderGeometry(1.5, 2, 8, 8);
    const padMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, opacity: 0.7, transparent: true });

    const leftPad = new THREE.Mesh(padGeo, padMaterial);
    leftPad.position.set(-12, -8, -2);
    leftPad.rotation.z = Math.PI / 6;
    group.add(leftPad);

    const rightPad = new THREE.Mesh(padGeo, padMaterial);
    rightPad.position.set(12, -8, -2);
    rightPad.rotation.z = -Math.PI / 6;
    group.add(rightPad);

    // 6. 3D Temple Arms extending backwards along -Z axis
    const templeLength = 120; // 120mm extending back towards ears
    const createTempleArm = (isLeft: boolean) => {
      const xSign = isLeft ? -1 : 1;
      const startX = xSign * (eyeSpacing / 2 + lensWidth / 2 - 2);

      const templeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, 2, 0),
        new THREE.Vector3(startX + xSign * 2, 1, -templeLength * 0.7),
        new THREE.Vector3(startX + xSign * 1, -12, -templeLength), // Ear curve downwards
      ]);
      const templeGeo = new THREE.TubeGeometry(templeCurve, 20, 2.2, 8, false);
      const templeMesh = new THREE.Mesh(templeGeo, frameMaterial);
      templeMesh.userData.isFrameMesh = true;

      // Hinge Cylinder
      const hingeGeo = new THREE.CylinderGeometry(2, 2, 6, 8);
      const hingeMesh = new THREE.Mesh(hingeGeo, frameMaterial);
      hingeMesh.position.set(startX, 2, 0);
      hingeMesh.userData.isFrameMesh = true;

      const templeGroup = new THREE.Group();
      templeGroup.add(templeMesh);
      templeGroup.add(hingeMesh);
      return templeGroup;
    };

    group.add(createTempleArm(true));  // Left Arm
    group.add(createTempleArm(false)); // Right Arm

    // Label for Demo Mode
    group.userData.isDemo3DModel = true;

    return group;
  }

  /**
   * Main real-time pose update method anchored to face tracking parameters
   */
  public updatePose(
    smoothedTransform: SmoothedTransform,
    calibration: TryOnCalibration,
    isMirrored: boolean = true
  ) {
    if (!this.canvas || smoothedTransform.trackingState === "lost") {
      this.wrapperGroup.visible = false;
      this.render();
      return;
    }

    this.wrapperGroup.visible = true;

    const canvasW = this.canvas.width || 1280;
    const canvasH = this.canvas.height || 720;

    // 1. Convert pixel anchor center to Three.js world space (Center of screen = 0,0)
    // In WebGL, +X is Right, +Y is Up. In canvas, +Y is Down.
    const worldX = smoothedTransform.x - canvasW / 2;
    const worldY = -(smoothedTransform.y - canvasH / 2);

    // Z position depth relative to eye distance (closer face = larger eyeDistancePx = higher Z)
    const baseZ = 0;
    const zOffsetFromCalib = (calibration.zOffset || 0) * 100;
    const worldZ = baseZ + zOffsetFromCalib;

    this.wrapperGroup.position.set(worldX, worldY, worldZ);

    // 2. Rotations (Pitch = X, Yaw = Y, Roll = Z)
    // Roll / Tilt
    const rollRad = (-smoothedTransform.rotationDeg * Math.PI) / 180;
    // Yaw / Head turning left/right
    const yawRad = ((isMirrored ? -smoothedTransform.yawDeg : smoothedTransform.yawDeg) * Math.PI) / 180;
    // Pitch / Head looking up/down
    const pitchRad = (smoothedTransform.pitchDeg * Math.PI) / 180;

    this.wrapperGroup.rotation.set(pitchRad, yawRad, rollRad, "YXZ");

    // 3. Physical Scaling based on Eye Distance and Frame Width
    // Standard 3D glasses width = ~140 units. Scale = targetPixelWidth / 140
    const targetWidthPx = smoothedTransform.width;
    const baseScale = targetWidthPx / 140;
    const calibScale = calibration.scale || 1.0;
    const totalScale = baseScale * calibScale;

    this.wrapperGroup.scale.set(totalScale, totalScale, totalScale);

    // 4. Fine-Tune Calibration Group Offsets (Local space offsets)
    const localX = (calibration.xOffset || 0) * 10;
    const localY = (calibration.yOffset || 0) * 10;
    const localZ = (calibration.zOffset || 0) * 10;

    this.calibrationGroup.position.set(localX, localY, localZ);

    const calibPitchRad = ((calibration.rotationX || 0) * Math.PI) / 180;
    const calibYawRad = ((calibration.rotationY || 0) * Math.PI) / 180;
    const calibRollRad = ((calibration.rotationZ || 0) * Math.PI) / 180;

    this.calibrationGroup.rotation.set(calibPitchRad, calibYawRad, calibRollRad);

    // 5. Render Three.js WebGL Frame
    this.render();
  }

  /**
   * Render single frame
   */
  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Helper to clean up group memory
   */
  private disposeGroup(group: THREE.Group) {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  }

  /**
   * Cleanup WebGL context and resources on unmount
   */
  public dispose() {
    if (this.currentModelGroup) {
      this.disposeGroup(this.currentModelGroup);
    }
    this.renderer.dispose();
  }
}
