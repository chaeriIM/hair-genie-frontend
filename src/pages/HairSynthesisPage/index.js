import React from 'react'
import Nav from '../../components/Nav'
import './HairSynthesisPage.css'
import { useNavigate } from 'react-router-dom'

const HairSynthesisPage = () => {

  const navigate = useNavigate();

  const navigateToWebcam = () => {
    navigate("/hair-webcampage");
  };

  const navigateToImageUpload = () => {
    navigate("/hair-uploadpage");
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p>지니 타임</p>
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

export default HairSynthesisPage