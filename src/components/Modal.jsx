import React, { useEffect } from 'react';
import '../styles/Modal.css';

const Modal = ({ image, onClose, onNext, onPrev, onDelete, currentIndex, totalImages }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleDelete = () => {
    if (window.confirm(`Delete "${image.title}"?`)) {
      onDelete(image.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <button className="modal-nav modal-prev" onClick={onPrev} aria-label="Previous">
          ‹
        </button>

        <img
          src={image.src}
          alt={image.alt}
          className="modal-image"
        />

        <button className="modal-nav modal-next" onClick={onNext} aria-label="Next">
          ›
        </button>

        <div className="modal-info">
          <h2>{image.title}</h2>
          {image.isUserImage && (
            <span className="modal-user-badge">Your Image</span>
          )}
          <p className="modal-counter">
            {currentIndex + 1} / {totalImages}
          </p>
          {onDelete && (
            <button className="modal-delete-btn" onClick={handleDelete}>
              🗑️ Delete Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
