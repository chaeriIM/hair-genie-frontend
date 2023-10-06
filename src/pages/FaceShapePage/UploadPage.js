import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import ImageUpload from '../../components/ImageUpload';
import './FaceShapePage.css';
import '../../App.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const [/* result, */ setResult] = useState(null);

  const navigateToResult = () => {
    navigate("/faceresult");
  };

  // 이미지를 선택하고 백엔드에 전송하는 함수
  const uploadAndAnalyzeImage = async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);

    try {
      const response = await fetch('http://127.0.0.1:8000/faceshape/analyze-face/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.predictions);
        navigateToResult();
      } else {
        // Handle error
        console.error('Failed to analyze face');
      }
    } catch (error) {
      // Handle error
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <hr />

      <div className='body-container'>
        {/* ImageUpload 컴포넌트에 이미지 업로드 함수를 전달 */}
        <ImageUpload onImageUploaded={uploadAndAnalyzeImage} />
        {/* <ImageUpload onImageUploaded={navigateToResult} /> */}

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