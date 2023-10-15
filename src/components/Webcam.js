import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './Webcam.css';

function WebcamCapture(props) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = async () => {
    const imageUrl = webcamRef.current.getScreenshot();
    setCapturedImage(imageUrl);

    const blob = await fetch(imageUrl).then((res) => res.blob());
    props.setValue(blob);
  };

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
        </div>
      )}
    </div>
  );
}

export default WebcamCapture