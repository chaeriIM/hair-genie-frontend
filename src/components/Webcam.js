import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './Webcam.css';

const WebcamCapture = ({ onImageUploaded }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageUrl = webcamRef.current.getScreenshot();
    setCapturedImage(imageUrl);
    localStorage.setItem('uploadedImage', imageUrl); //이미지 URL 저장
  };

  const navigate = () => {
    onImageUploaded();
  }

  return (
    <div className='container'>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture} className='shoot-btn'>촬영</button>
      {capturedImage && (
        <div className='container'>
          <img src={capturedImage} alt="Captured" />
          <button onClick={navigate} className='shoot-btn'>다음</button>
        </div>
      )}
    </div>
  );
}

export default WebcamCapture