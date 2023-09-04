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

      <div className='body-container'>
        <p className='about-title'>이미지를 업로드하여 얼굴형 분석 결과를 확인해 보세요.</p>
        <div className='select-container'>
          <button className='select-btn' onClick={navigateToWebcam}>
            <img src="/images/camera_icon.svg" alt="Webcam icon" class="camera-icon" />
            카메라
          </button>
          <button className='select-btn' onClick={navigateToImageUpload}>
            <img src="/images/picture_icon.svg" alt="ImageUpload icon" className="picture-icon" />
            사진
          </button>
        </div>
      </div>
    </div>
  )
}

export default FaceShapePage