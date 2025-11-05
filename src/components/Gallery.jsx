import React, { useState, useEffect } from 'react';
import GalleryItem from './GalleryItem';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import '../styles/Gallery.css';

const Gallery = ({ images: defaultImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  // Load images from localStorage on component mount
  useEffect(() => {
    loadImagesFromStorage();
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    const userImages = allImages.filter(img => img.isUserImage);
    if (userImages.length > 0) {
      try {
        localStorage.setItem('userImages', JSON.stringify(userImages));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          alert('Storage limit reached! Please delete some images.');
        }
      }
    }
  }, [allImages]);

  // Load images from localStorage
  const loadImagesFromStorage = () => {
    try {
      const savedImages = localStorage.getItem('userImages');
      const userImages = savedImages ? JSON.parse(savedImages) : [];
      setAllImages([...userImages, ...defaultImages]);
    } catch (e) {
      console.error('Error loading images:', e);
      setAllImages(defaultImages);
    }
  };

  // Add new user image
  const handleImageAdd = (newImage) => {
    setAllImages(prevImages => [newImage, ...prevImages]);
  };

  // Delete user image
  const handleImageDelete = (imageId) => {
    const updatedImages = allImages.filter(img => img.id !== imageId);
    setAllImages(updatedImages);

    // Update localStorage
    const userImages = updatedImages.filter(img => img.isUserImage);
    localStorage.setItem('userImages', JSON.stringify(userImages));

    // Close modal if deleted image was open
    if (selectedImage && selectedImage.id === imageId) {
      closeModal();
    }
  };

  // Clear all user images
  const handleClearUserImages = () => {
    if (window.confirm('Are you sure you want to delete all your uploaded images?')) {
      const defaultImagesOnly = allImages.filter(img => !img.isUserImage);
      setAllImages(defaultImagesOnly);
      localStorage.removeItem('userImages');
      closeModal();
    }
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const userImageCount = allImages.filter(img => img.isUserImage).length;

  return (
    <>
      <div className="gallery-container">
        <h1 className="gallery-title">CSS Grid Photo Gallery</h1>
        <p className="gallery-subtitle">
          Responsive Grid Layout Demo - Add your own images!
        </p>

        <ImageUploader onImageAdd={handleImageAdd} />

        {userImageCount > 0 && (
          <div className="gallery-stats">
            <span className="stats-info">
              📸 Your Images: {userImageCount} | Default Images: {allImages.length - userImageCount}
            </span>
            <button onClick={handleClearUserImages} className="clear-btn">
              🗑️ Clear My Images
            </button>
          </div>
        )}
        
        <div className="gallery-grid">
          {allImages.map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              onClick={() => openModal(image, index)}
              onDelete={image.isUserImage ? handleImageDelete : null}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <Modal
          image={selectedImage}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
          onDelete={selectedImage.isUserImage ? handleImageDelete : null}
          currentIndex={currentIndex}
          totalImages={allImages.length}
        />
      )}
    </>
  );
};

export default Gallery;
