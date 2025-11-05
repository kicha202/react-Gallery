import React, { useState } from 'react';
import '../styles/ImageUploader.css';

const ImageUploader = ({ onImageAdd }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  // Handle URL input method
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    
    if (!imageUrl.trim() || !imageTitle.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newImage = {
      id: Date.now(),
      src: imageUrl,
      alt: imageTitle,
      title: imageTitle,
      width: 400,
      height: 400,
      isUserImage: true
    };

    onImageAdd(newImage);
    
    // Reset form
    setImageUrl('');
    setImageTitle('');
    setShowForm(false);
  };

  // Handle file upload method
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const newImage = {
        id: Date.now(),
        src: reader.result, // Base64 encoded image
        alt: imageTitle || file.name,
        title: imageTitle || file.name,
        width: 400,
        height: 400,
        isUserImage: true
      };

      onImageAdd(newImage);
      
      // Reset form
      setImageTitle('');
      setShowForm(false);
      e.target.value = ''; // Clear file input
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <button 
        className="add-image-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '✕ Close' : '+ Add Your Own Image'}
      </button>

      {showForm && (
        <div className="upload-form">
          <div className="upload-methods">
            <button
              className={`method-btn ${uploadMethod === 'url' ? 'active' : ''}`}
              onClick={() => setUploadMethod('url')}
            >
              📎 Image URL
            </button>
            <button
              className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
              onClick={() => setUploadMethod('file')}
            >
              📁 Upload File
            </button>
          </div>

          {uploadMethod === 'url' ? (
            <form onSubmit={handleUrlSubmit} className="url-form">
              <input
                type="text"
                placeholder="Image Title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="url"
                placeholder="Paste Image URL here"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="form-input"
                required
              />
              <button type="submit" className="submit-btn">
                Add Image
              </button>
            </form>
          ) : (
            <div className="file-upload-form">
              <input
                type="text"
                placeholder="Image Title (optional)"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                className="form-input"
              />
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <span className="file-input-text">
                  📤 Choose Image File (Max 5MB)
                </span>
              </label>
              <p className="upload-info">
                Uploaded images are stored temporarily in your browser
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
