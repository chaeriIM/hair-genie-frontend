import React from 'react';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const HairResultPage = () => {

  const [resultImage, setResultImage] = useState('');

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
          {resultImage && <img src={`http://127.0.0.1:8000${resultImage}`} alt="로드 실패" />}
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