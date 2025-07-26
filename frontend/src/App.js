import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // 🌐 Verwijs naar je Cloud Function
      const response = await fetch(
        "https://us-central1-ai4all-platform-fe2e4.cloudfunctions.net/generateImage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || "No image returned.");
      }
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Generate an AI Image 🚀</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ width: "300px", padding: "0.5rem" }}
      />
      <br />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Generate
      </button>

      {loading && <p>Generating image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <img src={imageUrl} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default App;
