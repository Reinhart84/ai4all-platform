const functions = require('firebase-functions');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors')({ origin: true });

// 👉 Lees je API‑sleutel uit een omgevingsvariabele.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * HTTP‑trigger die een POST‑verzoek met een `prompt` accepteert,
 * het prompt doorstuurt naar de OpenAI API en het URL van het gegenereerde beeld terugstuurt.
 */
exports.generateImage = functions
  .runWith({ secrets: ["OPENAI_API_KEY"] }) // ✅ Secret declaratie toegevoegd
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
      }
      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          error:
            'OpenAI API key not configured. Set the OPENAI_API_KEY environment variable in Firebase.',
        });
      }

      // Voorbeeld‑aanroep naar OpenAI DALL·E (gpt-image-1) API
      const url = 'https://api.openai.com/v1/images/generations';
      try {
        const openaiRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt,
            n: 1,
            size: '1024x1024',
          }),
        });

        if (!openaiRes.ok) {
          const text = await openaiRes.text();
          return res.status(openaiRes.status).json({
            error: `OpenAI API error: ${text}`,
          });
        }

        const data = await openaiRes.json();
        const imageUrl = data.data?.[0]?.url;
        if (!imageUrl) {
          return res.status(500).json({
            error: 'No image returned from OpenAI',
          });
        }
        return res.status(200).json({ imageUrl });
      } catch (err) {
        console.error('Error calling OpenAI API:', err);
        return res.status(500).json({
          error: 'Internal server error',
          details: err.message,
        });
      }
    });
  });
