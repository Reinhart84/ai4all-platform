// frontend/src/App.js

import React, { useState, useEffect } from "react";
import "./styles.css";
import { generateImage, fetchImages } from "./api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Bij mount: haal direct de galerij op
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await fetchImages();
      if (data.images) {
        setGallery(data.images);
      }
    } catch (err) {
      console.error("Gallery load error:", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentImage(null);

    try {
      const data = await generateImage(prompt);
      if (data.imageUrl) {
        // Toon de net-gegenereerde afbeelding
        setCurrentImage({ url: data.imageUrl, prompt });
        // Vernieuw de galerij
        await loadGallery();
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
    <div className="app-container">
      <h1>AI Image Generator 🚀🚀</h1>

      {/* Generate-form */}
      <div className="form-container">
        <input
          className="prompt-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
        />
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate Image"}
        </button>
      </div>

      {/* Foutmelding */}
      {error && <p className="error">{error}</p>}

      {/* Net-gegenereerde afbeelding */}
      {currentImage && (
        <div className="current-image">
          <h2>Just Generated</h2>
          <img src={currentImage.url} alt={currentImage.prompt} />
          <p className="caption">{currentImage.prompt}</p>
        </div>
      )}

      {/* Galerie van opgeslagen afbeeldingen */}
      <h2>Gallery</h2>
      <div className="gallery">
        {gallery.map((img) => (
          <div key={img.id} className="card">
            <img src={img.imageUrl} alt={img.prompt} />
            <p className="caption">{img.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
