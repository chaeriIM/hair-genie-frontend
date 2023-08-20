import React from 'react'
import Webcam from '../../components/Webcam'
import Nav from '../../components/Nav'
import { useNavigate } from 'react-router-dom';

const WebcamPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/faceresult");
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p>얼굴형 분석</p>
      <hr />

      <Webcam onImageUploaded={navigateToResult}/>
    </div>
  
  )
}

export default WebcamPage