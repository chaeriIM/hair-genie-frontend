import React from 'react';
import Nav from '../../components/Nav';
import './FaceShapePage.css';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const FaceShapePage = () => {

  const navigate = useNavigate();

  const navigateToWebcam = () => {
    navigate("/face-webcampage");
  };

  const navigateToImageUpload = () => {
    navigate("/face-uploadpage");
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <hr />

      <div className='select-container'>
        <button className='select-btn' onClick={navigateToWebcam}>
          카메라
        </button>
        <button className='select-btn' onClick={navigateToImageUpload}>
          사진
        </button>
      </div>
    </div>
  )
}

export default FaceShapePage