import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Webcam from '../../components/Webcam';
import '../../App.css';

const WebcamPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairresult");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p className='main-title'>지니 타임</p>
      <hr />

      <div className='body-container'>
        <Webcam onImageUploaded={navigateToResult} />
      </div>
    </div>
  )
}

export default WebcamPage