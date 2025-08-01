// functions/index.js

// 1. Imports en globale instellingen
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Globale settings voor alle v2-functies in deze file
setGlobalOptions({
  secrets: ["OPENAI_API_KEY"],
  timeoutSeconds: 300,
  memory: "512Mi",
});

// 2. Handler-implementatie
async function generateImageHandler(req, res) {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          "OpenAI API key not configured. Zet de OPENAI_API_KEY secret in Firebase.",
      });
    }

    try {
      const openaiRes = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt,
            n: 1,
            size: "1024x1024",
          }),
        }
      );

      if (!openaiRes.ok) {
        const text = await openaiRes.text();
        return res.status(openaiRes.status).json({ error: text });
      }

      const { data } = await openaiRes.json();
      const imageUrl = data?.[0]?.url;
      if (!imageUrl) {
        return res.status(500).json({ error: "No image returned." });
      }

      // Opslaan in Firestore
      await db.collection("images").add({
        prompt,
        imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ imageUrl });
    } catch (err) {
      console.error("Error calling OpenAI API:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

// 3. Exporteren van de v2–functie
exports.generateImage = onRequest(
  { region: "us-central1" },
  generateImageHandler
);
