import React, { useState } from 'react';
import Webcam from '../../components/Webcam';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const WebcamPage = () => {
  const navigate = useNavigate();
  const [/* result */, setResult] = useState(null);

  const navigateToResult = () => {
    navigate("/faceresult");
  };

  // 웹캠 컴포넌트에서 이미지를 캡처하고 백엔드에 전송하는 함수
  const captureAndAnalyzeImage = async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);

    try {
      const response = await fetch('http://127.0.0.1:8000/faceshape/analyze-face/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.predictions);
        navigateToResult();
      } else {
        // Handle error
        console.error('Failed to analyze face');
      }
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <hr />

      <div className='body-container'>
        {/* Webcam 컴포넌트에 이미지 캡처 함수를 전달 */}
        <Webcam onImageCaptured={captureAndAnalyzeImage} />
        {/* <Webcam onImageUploaded={navigateToResult} /> */}
      </div>
    </div>
  )
}

export default WebcamPage