import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import ImageUpload from '../../components/ImageUpload';
import './FaceShapePage.css';
import '../../App.css';

const UploadPage = () => {
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
        <ImageUpload onImageUploaded={navigateToResult} />
        {/* <div className='container'>
        <button className='result-btn' onClick={navigateToResult}>
          분석
        </button>
      </div> */}
      </div>
    </div>
  )
}

export default UploadPage