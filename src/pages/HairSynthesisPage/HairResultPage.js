import React from 'react';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const HairResultPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairsynthesis");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p className='main-title'>지니 타임</p>
      <hr />

      <div className='body-container'>
        <div className='container'>

          <div className='result-image'>
            결과물
          </div>

          <button className='result-btn' onClick={navigateToResult}>
            이전
          </button>

        </div>
      </div>
    </div>
  )
}

export default HairResultPage