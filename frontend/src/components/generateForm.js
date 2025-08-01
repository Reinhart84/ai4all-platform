// functie-gericht component voor prompt + generate-button
import React, { useState } from "react";

export default function GenerateForm({ onGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const data = await onGenerated(prompt);
    setLoading(false);
    return data;
  };

  return (
    <div className="form-container">
      <input
        className="prompt-input"
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image…"
      />
      <button
        className="generate-btn"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Generating…" : "Generate Image"}
      </button>
    </div>
  );
}
