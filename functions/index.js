const functions = require('firebase-functions');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors')({ origin: true });

// HTTP‑trigger: accepteert POST‑verzoeken met een `prompt`.
// Stuurt de prompt door naar de Zapier‑webhook en retourneert het resultaat.
exports.zapierWebhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Zapier‑webhook URL (aanpassen via Zapier indien nodig)
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/23622949/u2jb6hw/';

    try {
      const zapierResponse = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const contentType = zapierResponse.headers.get('content-type') || '';
      if (!zapierResponse.ok) {
        const text = await zapierResponse.text();
        return res.status(500).json({ error: `Zapier error: ${text}` });
      }
      if (contentType.includes('application/json')) {
        const data = await zapierResponse.json();
        return res.status(200).json(data);
      } else {
        const text = await zapierResponse.text();
        return res.status(200).json({ result: text });
      }
    } catch (err) {
      console.error('Interne serverfout:', err);
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  });
});
