import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Shared Gemini client initializer
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "ILens Eyewear Server" });
  });

  // 1. AI Assistant Endpoint
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { messages, userQuery } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are "Aura", the expert AI Optical Stylist and Eyewear Consultant for ILens Eyewear.
ILens offers high-end prescription eyeglasses, sunglasses, blue light glasses, contact lenses, and custom optical lenses.
You are extremely knowledgeable about:
- Frame shapes (Round, Oval, Square, Cat-Eye, Aviator, Geometric, Wayfarer)
- Face shapes suitability (e.g. Round faces look great with angular/square frames; Square faces suit oval/round frames)
- Prescription lens indices (1.50 standard, 1.60 thin, 1.67 super-thin, 1.74 ultra-thin)
- Lens coatings (Anti-reflective, Blue Shield, Transitions/Photochromic, Anti-scratch, Hydrophobic)
- Frame dimensions (e.g. 52-18-140 mm meaning lens width, bridge width, temple length)
- Order tracking, 30-day free returns, 1-year frame warranty, and booking eye tests at ILens stores.

Be warm, elegant, concise, helpful, and luxury-oriented. Always provide actionable advice and suggest relevant ILens styles or lens options.`;

      let promptText = userQuery || "Hello! Can you help me find the perfect glasses?";
      if (messages && Array.isArray(messages) && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.text) {
          promptText = lastMsg.text;
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I am here to help you select your ideal ILens frames and optical lenses.";
      res.json({ success: true, reply });
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to consult AI Stylist.",
        fallback: "Our AI optical stylist is temporarily taking a breather. Feel free to browse our categories or try our Virtual Try-On tool!",
      });
    }
  });

  // 2. AI Face Shape Analysis Endpoint
  app.post("/api/gemini/face-shape", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        res.status(400).json({ success: false, error: "Image data is required" });
        return;
      }

      const ai = getGeminiClient();
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      };

      const promptText = `Analyze this face photo for optical frame selection.
Determine:
1. Primary Face Shape (Choose exactly one: "Oval", "Round", "Square", "Heart", "Diamond", or "Oblong").
2. Key Facial Characteristics (Jawline, cheekbones, forehead balance).
3. Recommended Frame Shapes (e.g., Cat-Eye, Square, Round, Wayfarer, Geometric).
4. Frame Shapes to Avoid.
5. Stylist Advice (2-3 sentences of personalized recommendation for glasses).

Return JSON matching this exact structure:
{
  "faceShape": "Face Shape Name",
  "confidence": 94,
  "characteristics": ["Desc 1", "Desc 2"],
  "recommendedFrameShapes": ["Cat-Eye", "Square", "Geometric"],
  "avoidFrameShapes": ["Tiny Round"],
  "stylistAdvice": "Specific styling guidance based on face structure..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, { text: promptText }] },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsedData = JSON.parse(text);
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error("Face Shape Analysis Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze face shape.",
        fallback: {
          faceShape: "Oval",
          confidence: 88,
          characteristics: ["Balanced proportions", "Gently curved jawline", "Slightly wider cheekbones"],
          recommendedFrameShapes: ["Geometric", "Square", "Cat-Eye", "Aviator"],
          avoidFrameShapes: ["Overly wide oversized frames"],
          stylistAdvice: "Oval face shapes are remarkably versatile! Almost any frame shape flatters your balanced proportions. We recommend bold geometric or classic square frames for contrast.",
        },
      });
    }
  });

  // 3. AI Style Finder Endpoint
  app.post("/api/gemini/style-finder", async (req, res) => {
    try {
      const { answers } = req.body;
      const ai = getGeminiClient();

      const promptText = `A customer completed the ILens AI Style Quiz with these preferences:
${JSON.stringify(answers, null, 2)}

Provide a curated style recommendation report:
1. Aesthetic Profile Title (e.g., "Minimalist Architectural", "Retro Glamour", "Modern Executive", "Avant-Garde Edge")
2. Summary Persona Description (2 sentences)
3. Recommended Frame Features (Colors, Materials, Silhouettes)
4. Key Style Advice

Return JSON:
{
  "profileTitle": "Profile Name",
  "personaDescription": "Description...",
  "recommendedShapes": ["Square", "Cat-Eye"],
  "recommendedMaterials": ["Titanium", "Italian Acetate"],
  "recommendedColors": ["Tortoise Shell", "Champagne Gold", "Matte Black"],
  "advice": "Stylist tips..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, recommendation: parsed });
    } catch (error: any) {
      console.error("Style Finder Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Style Finder failed.",
        fallback: {
          profileTitle: "Refined Modern Minimalist",
          personaDescription: "You appreciate sleek lines, ultra-lightweight craftsmanship, and timeless elegance that transitions effortlessly from work to weekend.",
          recommendedShapes: ["Rectangle", "Geometric", "Aviator"],
          recommendedMaterials: ["Japanese Titanium", "Bio-Acetate"],
          recommendedColors: ["Rose Gold", "Matte Black", "Crystal Clear"],
          advice: "Choose lightweight titanium frames with clean architectural bridge details for a sophisticated, weightless feel.",
        },
      });
    }
  });

  // 4. Camera Search / Visual Match Endpoint
  app.post("/api/gemini/camera-search", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        res.status(400).json({ success: false, error: "Image required" });
        return;
      }

      const ai = getGeminiClient();
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      };

      const promptText = `Analyze this eyewear image and identify key visual traits:
- Frame Type: (eyeglasses, sunglasses, blue_light)
- Shape: (round, square, aviator, cat-eye, rectangle, geometric)
- Primary Color: (black, gold, silver, tortoise, clear, brown)
- Material Look: (metal, acetate, titanium)
- Vibe / Key Details: (double bridge, thin rim, bold acetate, gradient lens)

Return JSON:
{
  "shape": "cat-eye",
  "category": "eyeglasses",
  "primaryColor": "tortoise",
  "material": "acetate",
  "keywords": ["cat-eye", "tortoise", "bold", "acetate"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, { text: promptText }] },
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, matchCriteria: parsed });
    } catch (error: any) {
      console.error("Camera Search Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Camera search failed",
        fallback: {
          shape: "square",
          category: "eyeglasses",
          primaryColor: "black",
          material: "acetate",
          keywords: ["square", "black", "classic"],
        },
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ILens Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
