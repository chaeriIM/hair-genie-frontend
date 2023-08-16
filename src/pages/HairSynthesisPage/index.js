import React from 'react'
import Nav from '../../components/Nav'
import './HairSynthesisPage.css'
import ImageUpload from '../../components/ImageUpload'
import { useNavigate } from 'react-router-dom'

const HairSynthesisPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairresult");
  };

  const handleImageUpload = () => {
    navigateToResult();
  }

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p>지니 타임</p>
      <hr />
      <ImageUpload onImageUploaded={handleImageUpload} />
      {/* <div className='container'>
        <button className='result-btn' onClick={navigateToResult}>
          합성
        </button>
      </div> */}
    </div>
  )
}

export default HairSynthesisPage