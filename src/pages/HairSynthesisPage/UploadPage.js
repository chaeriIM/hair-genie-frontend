import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import ImageUpload from '../../components/ImageUpload';
import './HairSynthesisPage.css';

const UploadPage = () => {
  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairresult");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p>지니 타임</p>
      <hr />
      <ImageUpload onImageUploaded={navigateToResult} />
      {/* <div className='container'>
        <button className='result-btn' onClick={navigateToResult}>
          합성
        </button>
      </div> */}
    </div>
  )
}

export default UploadPage