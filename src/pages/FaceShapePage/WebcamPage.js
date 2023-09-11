import React from 'react';
import Webcam from '../../components/Webcam';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const WebcamPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/faceresult");
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <hr />

      <div className='body-container'>
        <Webcam onImageUploaded={navigateToResult} />
      </div>
    </div>
  )
}

export default WebcamPage