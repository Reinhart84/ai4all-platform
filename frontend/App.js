import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch('https://us-central1-ai4all-platform-fe2e4.cloudfunctions.net/zapierWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        alert('Geen afbeelding ontvangen. Controleer of je Zapier juist is geconfigureerd.');
      }
    } catch (error) {
      console.error('Fout bij genereren:', error);
      alert('Er ging iets mis. Kijk in de console voor details.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>DALL·E 2 Generator</h1>
      <input
        type="text"
        placeholder="Geef je prompt in..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <button
        onClick={generateImage}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Genereer
      </button>

      {loading && <p>Bezig met genereren...</p>}

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Gegenereerde afbeelding" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default App;
