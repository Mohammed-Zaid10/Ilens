import { Product } from "../types";

/**
 * Generates an SVG Data URI for transparent high-resolution AR glasses frames
 * tailored to product shape, color, and frame material.
 */
export function getProductArFrameSvg(product: Product, colorHex?: string): string {
  const frameColor = colorHex || product.colors?.[0]?.hex || "#1e293b"; // Default dark frame color
  const shape = product.frameShape?.toLowerCase() || "round";

  // Lens gradient fill with realistic anti-reflective glass glare
  const glassGradient = `
    <defs>
      <linearGradient id="lensGlaze" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32" />
        <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.12" />
        <stop offset="70%" stop-color="#a855f7" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
      <linearGradient id="frameMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${frameColor}" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${frameColor}" />
      </linearGradient>
      <filter id="subtleDropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25" />
      </filter>
    </defs>
  `;

  let framePaths = "";

  switch (shape) {
    case "geometric":
    case "octagonal":
      // Geometric Octagonal Frame
      framePaths = `
        <!-- Left Lens & Frame -->
        <polygon points="60,35 110,25 150,35 160,80 150,115 110,125 60,115 50,80" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="6" stroke-linejoin="round" />
        <!-- Right Lens & Frame -->
        <polygon points="240,35 290,25 340,35 350,80 340,115 290,125 240,115 230,80" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="6" stroke-linejoin="round" />
        <!-- Bridge -->
        <path d="M158,55 Q200,45 232,55" fill="none" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" />
        <!-- Temples -->
        <path d="M50,70 L10,65" stroke="${frameColor}" stroke-width="6" stroke-linecap="round" />
        <path d="M350,70 L390,65" stroke="${frameColor}" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "cat-eye":
      // Elegant Cat-Eye
      framePaths = `
        <!-- Left Lens & Frame -->
        <path d="M 35,30 C 90,10 150,30 160,65 C 165,100 130,125 90,125 C 50,125 30,95 35,30 Z" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="8" stroke-linejoin="round" />
        <!-- Right Lens & Frame -->
        <path d="M 365,30 C 310,10 250,30 240,65 C 235,100 270,125 310,125 C 350,125 370,95 365,30 Z" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="8" stroke-linejoin="round" />
        <!-- Cat-Eye Wing Accents -->
        <path d="M 30,30 L 15,20 L 45,28 Z" fill="${frameColor}" />
        <path d="M 370,30 L 385,20 L 355,28 Z" fill="${frameColor}" />
        <!-- Bridge -->
        <path d="M158,58 Q200,48 242,58" fill="none" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" />
        <!-- Temples -->
        <path d="M25,25 L5,20" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" />
        <path d="M375,25 L395,20" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" />
      `;
      break;

    case "aviator":
      // Teardrop Aviator Frame
      framePaths = `
        <!-- Left Lens -->
        <path d="M 50,35 C 100,30 155,35 155,75 C 155,120 110,135 80,125 C 50,115 45,75 50,35 Z" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="5" stroke-linejoin="round" />
        <!-- Right Lens -->
        <path d="M 350,35 C 300,30 245,35 245,75 C 245,120 290,135 320,125 C 350,115 355,75 350,35 Z" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="5" stroke-linejoin="round" />
        <!-- Double Bridge -->
        <path d="M145,40 L255,40" fill="none" stroke="${frameColor}" stroke-width="5" />
        <path d="M152,58 Q200,52 248,58" fill="none" stroke="${frameColor}" stroke-width="5" />
        <!-- Temples -->
        <path d="M48,55 L8,50" stroke="${frameColor}" stroke-width="5" />
        <path d="M352,55 L392,50" stroke="${frameColor}" stroke-width="5" />
      `;
      break;

    case "square":
    case "wayfarer":
      // Classic Wayfarer / Bold Square Acetate
      framePaths = `
        <!-- Left Rim -->
        <rect x="40" y="30" width="120" height="90" rx="18" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="10" />
        <!-- Right Rim -->
        <rect x="240" y="30" width="120" height="90" rx="18" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="10" />
        <!-- Keyhole Bridge -->
        <path d="M 158,50 Q 200,38 242,50 L 242,65 Q 200,75 158,65 Z" fill="${frameColor}" />
        <!-- Corner Pins -->
        <circle cx="48" cy="40" r="2.5" fill="#e2e8f0" />
        <circle cx="352" cy="40" r="2.5" fill="#e2e8f0" />
        <!-- Temples -->
        <path d="M 38,45 L 8,40" stroke="${frameColor}" stroke-width="9" stroke-linecap="round" />
        <path d="M 362,45 L 392,40" stroke="${frameColor}" stroke-width="9" stroke-linecap="round" />
      `;
      break;

    case "browline":
    case "clubmaster":
      // Classic Browline Frame
      framePaths = `
        <!-- Thick Upper Brow Acetate -->
        <path d="M 35,35 Q 100,25 162,35 L 162,55 Q 100,45 35,50 Z" fill="${frameColor}" />
        <path d="M 365,35 Q 300,25 238,35 L 238,55 Q 300,45 365,50 Z" fill="${frameColor}" />
        <!-- Lower Wire Rim Left -->
        <path d="M 40,50 C 40,110 158,110 158,52" fill="url(#lensGlaze)" stroke="#94a3b8" stroke-width="4" />
        <!-- Lower Wire Rim Right -->
        <path d="M 360,50 C 360,110 242,110 242,52" fill="url(#lensGlaze)" stroke="#94a3b8" stroke-width="4" />
        <!-- Metallic Bridge -->
        <path d="M 160,48 Q 200,38 240,48" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "round":
    default:
      // Perfectly Rounded Frame
      framePaths = `
        <!-- Left Lens -->
        <circle cx="105" cy="75" r="50" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="7" />
        <!-- Right Lens -->
        <circle cx="295" cy="75" r="50" fill="url(#lensGlaze)" stroke="${frameColor}" stroke-width="7" />
        <!-- Saddle Bridge -->
        <path d="M 153,68 Q 200,52 247,68" fill="none" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" />
        <!-- Temples -->
        <path d="M 54,75 L 14,70" stroke="${frameColor}" stroke-width="6" stroke-linecap="round" />
        <path d="M 346,75 L 386,70" stroke="${frameColor}" stroke-width="6" stroke-linecap="round" />
      `;
      break;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" width="800" height="300">
      ${glassGradient}
      <g filter="url(#subtleDropShadow)">
        ${framePaths}
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
