import React from 'react'
import Nav from '../../components/Nav'
import { useNavigate } from 'react-router-dom';
import FaceShape from '../../components/FaceShape';

const FaceResultPage = () => {

  const navigate = useNavigate();

  const navigateToResult = () => {
    navigate("/faceshape");
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p>얼굴형 분석</p>
      <hr />

      <div className='container'>

        {/* <div className='result-image'>
          결과물
        </div>
        <p>OO형</p> */}
        <FaceShape />
        <button className='result-btn' onClick={navigateToResult}>
          이전
        </button>

      </div>
    </div>
  )
}

export default FaceResultPage