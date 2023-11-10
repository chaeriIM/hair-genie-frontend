import React, { useState } from 'react';
import './ImageUpload.css'

function ImageUpload(props) {

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      props.setValue(selectedFile);
    }
  };

  return (
    <div className='imageupload'>
      <div className='container'>
        <label htmlFor={props.inputId} className="upload-label">
          <div className='image-container'>
            {selectedImage ? (
              <img src={selectedImage} alt="Uploaded" className="uploaded-image" />
            ) : (
              <div className="placeholder">정면 사진을 업로드하세요.</div>
            )}
          </div>
        </label>

        <input id={props.inputId} type='file' accept='image/*' onChange={handleImageUpload} />
      </div>
    </div>
  )
}

export default ImageUpload