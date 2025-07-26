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
      const response = await fetch("https://generateimage-ks5pduma2a-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Generate an AI Image</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ width: "300px", padding: "0.5rem" }}
      />
      <button onClick={handleGenerate} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
        Generate
      </button>

      {loading && <p>Generating image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: "2rem" }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default App;
