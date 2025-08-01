// toont de laatst gegenereerde afbeeldingen
import React, { useEffect, useState } from "react";

export default function Gallery({ fetchFn }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      const { images: imgs } = await fetchFn();
      setImages(imgs);
    })();
  }, [fetchFn]);

  return (
    <div className="gallery">
      {images.map((img) => (
        <div key={img.id} className="card">
          <img src={img.imageUrl} alt={img.prompt} />
          <p className="caption">{img.prompt}</p>
        </div>
      ))}
    </div>
  );
}
