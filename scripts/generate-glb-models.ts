import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as fs from "fs";
import * as path from "path";

// Node.js FileReader polyfill for GLTFExporter binary mode
if (typeof globalThis.FileReader === "undefined") {
  (globalThis as any).FileReader = class FileReader {
    public result: ArrayBuffer | string | null = null;
    public onloadend: (() => void) | null = null;
    public onerror: ((err: any) => void) | null = null;

    public readAsArrayBuffer(blob: Blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }

    public readAsDataURL(blob: Blob) {
      blob.arrayBuffer().then((buf) => {
        const base64 = Buffer.from(buf).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

function create3DGlassesModel(shape: string, frameColorHex: string, lensColorHex: string, isSunglasses: boolean): THREE.Group {
  const group = new THREE.Group();

  const frameColor = new THREE.Color(frameColorHex);
  const lensColor = new THREE.Color(lensColorHex);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: frameColor,
    metalness: 0.7,
    roughness: 0.2,
    name: "FrameMaterial",
  });

  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: lensColor,
    transmission: isSunglasses ? 0.35 : 0.9,
    opacity: isSunglasses ? 0.85 : 0.45,
    transparent: true,
    roughness: 0.05,
    metalness: 0.1,
    ior: 1.5,
    thickness: 2.0,
    name: "LensMaterial",
  });

  const eyeSpacing = 72; // mm
  const lensWidth = 50;
  const lensHeight = shape === "aviator" ? 48 : shape === "cat-eye" ? 42 : shape === "round" ? 46 : 40;
  const rimDepth = 10;

  const createLensShape = (w: number, h: number, fShape: string) => {
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
    } else {
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

  // Left Rim
  const leftRim = new THREE.Mesh(rimGeo, frameMaterial);
  leftRim.position.set(-eyeSpacing / 2, 0, 0);
  leftRim.name = "LeftRim_FrameMesh";
  leftRim.userData.isFrameMesh = true;
  group.add(leftRim);

  // Right Rim
  const rightRim = new THREE.Mesh(rimGeo, frameMaterial);
  rightRim.position.set(eyeSpacing / 2, 0, 0);
  rightRim.name = "RightRim_FrameMesh";
  rightRim.userData.isFrameMesh = true;
  group.add(rightRim);

  // Lenses
  const lensShape = createLensShape(lensWidth, lensHeight, shape);
  const lensGeo = new THREE.ShapeGeometry(lensShape);
  lensGeo.center();

  const leftLens = new THREE.Mesh(lensGeo, lensMaterial);
  leftLens.position.set(-eyeSpacing / 2, 0, rimDepth / 2);
  leftLens.name = "LeftLens";
  group.add(leftLens);

  const rightLens = new THREE.Mesh(lensGeo, lensMaterial);
  rightLens.position.set(eyeSpacing / 2, 0, rimDepth / 2);
  rightLens.name = "RightLens";
  group.add(rightLens);

  // Bridge
  const bridgeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-eyeSpacing / 2 + lensWidth / 2 - 2, 2, rimDepth / 2),
    new THREE.Vector3(0, 6, rimDepth / 2 + 2),
    new THREE.Vector3(eyeSpacing / 2 - lensWidth / 2 + 2, 2, rimDepth / 2),
  ]);
  const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 16, 2.5, 8, false);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, frameMaterial);
  bridgeMesh.name = "Bridge_FrameMesh";
  bridgeMesh.userData.isFrameMesh = true;
  group.add(bridgeMesh);

  // Temple Arms
  const templeLength = 120;
  const createTempleArm = (isLeft: boolean) => {
    const xSign = isLeft ? -1 : 1;
    const startX = xSign * (eyeSpacing / 2 + lensWidth / 2 - 2);

    const templeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, 2, 0),
      new THREE.Vector3(startX + xSign * 2, 1, -templeLength * 0.7),
      new THREE.Vector3(startX + xSign * 1, -12, -templeLength),
    ]);
    const templeGeo = new THREE.TubeGeometry(templeCurve, 20, 2.2, 8, false);
    const templeMesh = new THREE.Mesh(templeGeo, frameMaterial);
    templeMesh.name = isLeft ? "LeftTemple_FrameMesh" : "RightTemple_FrameMesh";
    templeMesh.userData.isFrameMesh = true;

    const hingeGeo = new THREE.CylinderGeometry(2, 2, 6, 8);
    const hingeMesh = new THREE.Mesh(hingeGeo, frameMaterial);
    hingeMesh.position.set(startX, 2, 0);
    hingeMesh.name = isLeft ? "LeftHinge_FrameMesh" : "RightHinge_FrameMesh";
    hingeMesh.userData.isFrameMesh = true;

    const templeGroup = new THREE.Group();
    templeGroup.add(templeMesh);
    templeGroup.add(hingeMesh);
    return templeGroup;
  };

  group.add(createTempleArm(true));
  group.add(createTempleArm(false));

  return group;
}

async function exportGlb(group: THREE.Group, outputPath: string) {
  const exporter = new GLTFExporter();

  return new Promise<void>((resolve, reject) => {
    exporter.parse(
      group,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          fs.writeFileSync(outputPath, Buffer.from(gltf));
          console.log(`Generated GLB model: ${outputPath} (${gltf.byteLength} bytes)`);
          resolve();
        } else {
          const jsonStr = JSON.stringify(gltf);
          fs.writeFileSync(outputPath, jsonStr);
          console.log(`Generated GLTF JSON model: ${outputPath}`);
          resolve();
        }
      },
      (err) => {
        console.error(`Export failed for ${outputPath}:`, err);
        reject(err);
      },
      { binary: true }
    );
  });
}

async function main() {
  const dir = path.join(process.cwd(), "public", "models", "glasses");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const modelsToBuild = [
    { name: "aero-round-gold.glb", shape: "round", frameColor: "#d4af37", lensColor: "#0f172a", isSunglasses: true },
    { name: "aero-round-black.glb", shape: "round", frameColor: "#111111", lensColor: "#e0f2fe", isSunglasses: false },
    { name: "nova-silver.glb", shape: "cat-eye", frameColor: "#c0c0c0", lensColor: "#f8fafc", isSunglasses: false },
    { name: "classic-brown.glb", shape: "square", frameColor: "#5c3d2e", lensColor: "#1e293b", isSunglasses: true },
    { name: "aviator-gold.glb", shape: "aviator", frameColor: "#eab308", lensColor: "#0284c7", isSunglasses: true },
  ];

  for (const m of modelsToBuild) {
    const group = create3DGlassesModel(m.shape, m.frameColor, m.lensColor, m.isSunglasses);
    const outPath = path.join(dir, m.name);
    await exportGlb(group, outPath);
  }

  console.log("All 3D GLB eyewear models generated successfully!");
}

main().catch(console.error);
