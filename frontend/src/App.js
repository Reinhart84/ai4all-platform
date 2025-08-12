import React, { useState, useEffect } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lees eerder opgeslagen afbeeldingen uit localStorage
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem("images");
    return saved ? JSON.parse(saved) : [];
  });

  // Sla afbeeldingen op in localStorage wanneer de lijst verandert
  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch(
        "https://us-central1-ai4all-platform-fe2e4.cloudfunctions.net/generateImage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        // Voeg het nieuwe image toe aan de lijst
        setImages((prev) => [...prev, data.imageUrl]);
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Generate an AI Image 🚀🚀🚀🚀</h1>
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

      {/* Toon de meest recent gegenereerde afbeelding */}
      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Latest image</h2>
          <img
            src={imageUrl}
            alt="Generated"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}

      {/* Toon alle opgeslagen afbeeldingen */}
      {images.length > 0 && (
        <div style={{ marginTop: "40px", textAlign: "left" }}>
          <h2>Saved images</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Saved ${idx}`}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
