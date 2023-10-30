import React from 'react';
import Nav from '../../components/Nav';
import './HairSynthesisPage.css';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const HairSynthesisPage = () => {

  const navigate = useNavigate();

  const navigateToWebcam = () => {
    navigate("/hair-webcampage");
  };

  const navigateToImageUpload = () => {
    navigate("/hair-uploadpage");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p className='main-title'>헤어스타일 합성</p>
      <hr />

      <div className='body-container'>
        <p className='about-title'>이미지를 업로드하여 헤어스타일 합성 결과를 확인해 보세요.</p>
        <div className='select-container'>
          <button className='select-btn' onClick={navigateToWebcam}>
            <img src="/images/camera_icon.svg" alt="Webcam icon" className="camera-icon" />
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

export default HairSynthesisPage
