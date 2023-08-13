import React, { useState } from 'react';
import './ImageUpload.css'

const ImageUpload = () => {

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className='imageupload'>
      <div className='container'>
        <label htmlFor="upload-button" className="upload-label">
          <div className='image-container'>
            {selectedImage ? (
              <img src={selectedImage} alt="Uploaded" className="uploaded-image" />
            ) : (
              <div className="placeholder">정면 사진을 업로드하세요</div>
            )}
          </div>
        </label>

        <input type='file' accept='image/*' onChange={handleImageUpload} />
      </div>
    </div>
  )
}

export default ImageUpload