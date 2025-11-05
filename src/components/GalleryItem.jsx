import React from 'react';
import '../styles/GalleryItem.css';

const GalleryItem = ({ image, onClick, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${image.title}"?`)) {
      onDelete(image.id);
    }
  };

  return (
    <div className="gallery-item" onClick={onClick}>
      {image.isUserImage && (
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          aria-label="Delete image"
        >
          ✕
        </button>
      )}
      {image.isUserImage && (
        <span className="user-badge">Your Image</span>
      )}
      <img
        src={image.src}
        alt={image.alt}
        className="gallery-image"
        loading="lazy"
      />
      <div className="gallery-overlay">
        <h3 className="gallery-image-title">{image.title}</h3>
        <span className="view-icon">🔍</span>
      </div>
    </div>
  );
};

export default GalleryItem;
