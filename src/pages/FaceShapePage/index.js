import React from 'react'
import Nav from '../../components/Nav'
import './FaceShapePage.css'
import ImageUpload from '../../components/ImageUpload'
import { useNavigate } from 'react-router-dom'

const FaceShapePage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/faceresult");
  };

  const handleImageUpload = () => {
    navigateToResult();
  }

  return (
    <div className='faceshape'>
      <Nav />
      <p>얼굴형 분석</p>
      <hr />
      <ImageUpload onImageUploaded={handleImageUpload} />
      {/* <div className='container'>
        <button className='result-btn' onClick={navigateToResult}>
          분석
        </button>
      </div> */}
    </div>
  )
}

export default FaceShapePage