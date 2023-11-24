import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './HairSynthesisPage.css';
import Chatbot from '../../components/Chatbot';

const HairResultPage = () => {

  const [resultImage, setResultImage] = useState('');

  const navigate = useNavigate();

  const navigateToPrevious = () => {
    navigate("/hairsynthesis");
    localStorage.removeItem('hair_synthesis_result');
  };

  const handleDownload = () => {
    fetch(`http://127.0.0.1:8000${resultImage}`)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hair_synthesis_result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('다운로드 에러:', error);
    });
  }

  useEffect(() => {
    const result_image = localStorage.getItem('hair_synthesis_result');
    setResultImage(result_image + `?${new Date().getTime()}`);
  }, []);

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p className='main-title'>헤어스타일 합성</p>
      <Alert />
      <hr />

      <div className='body-container'>
        <div className='container'>

          <div className='result-image'>
          {resultImage && <img src={`http://127.0.0.1:8000${resultImage}`} alt="resultImage" />}
          </div>

          <div>
            <button className='result-btn' onClick={navigateToPrevious}>
              다시 하기
            </button>
            <button className='down-btn' onClick={handleDownload}>
              저장
            </button>
          </div>

        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default HairResultPage