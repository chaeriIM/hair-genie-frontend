import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Webcam from '../../components/Webcam';

const WebcamPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairresult");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p>지니 타임</p>
      <hr />

      <Webcam onImageUploaded={navigateToResult}/>
    </div>
  )
}

export default WebcamPage