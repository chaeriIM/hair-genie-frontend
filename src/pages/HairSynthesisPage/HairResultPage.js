import React from 'react'
import Nav from '../../components/Nav'
import { useNavigate } from 'react-router-dom';

const HairResultPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/hairsynthesis");
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p>지니 타임</p>
      <hr />

      <div className='container'>

        <div className='result-image'>
          결과물
        </div>

        <button className='result-btn' onClick={navigateToResult}>
          이전
        </button>
        
      </div>
    </div>
  )
}

export default HairResultPage