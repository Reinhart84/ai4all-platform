import React, { useState, useEffect } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem("images");
    return saved ? JSON.parse(saved) : [];
  });

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
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 AI Image Generator</h1>

      <div style={styles.card}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          style={styles.input}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {imageUrl && (
        <div style={styles.section}>
          <h2 style={styles.subheading}>🖼️ Latest Image</h2>
          <img src={imageUrl} alt="Generated" style={styles.mainImage} />
        </div>
      )}

      {images.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.subheading}>💾 Saved Images</h2>
          <div style={styles.gallery}>
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Saved ${idx}`} style={styles.thumb} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2.2rem",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  section: {
    marginTop: "40px",
    textAlign: "center",
  },
  subheading: {
    marginBottom: "20px",
  },
  mainImage: {
    maxWidth: "100%",
    borderRadius: "10px",
  },
  gallery: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  thumb: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
};

export default App;
