import React, { useState } from 'react';
import Nav from '../../components/Nav';
import './HairSynthesisPage.css';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios'; 

const HairSynthesisPage = () => {
  const navigate = useNavigate();
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [isImage1Selected, setIsImage1Selected] = useState(false);
  const [isImage2Selected, setIsImage2Selected] = useState(false);
  const [hairsynthesisImageUrl, sethairsynthesisImageUrl] = useState('');

  const handleImageSelect1 = (event) => {
    const file = event.target.files[0];
    setSelectedImage1(URL.createObjectURL(file));
    setIsImage1Selected(true);
  };

  const handleImageSelect2 = (event) => {
    const file = event.target.files[0];
    setSelectedImage2(URL.createObjectURL(file));
    setIsImage2Selected(true);
  };

  const handleConfirmation = async () => {
    if (isImage1Selected && isImage2Selected) {
      try {
        const formData = new FormData();
        formData.append('image1', selectedImage1);
        formData.append('image2', selectedImage2);

        // Axios를 사용하여 백엔드 API에 POST 요청
        const response = await axios.post('http://localhost:8000/hairsynthesis/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const resultImageUrl = response.data.result_image_url;
          // 결과 이미지를 사용하거나 표시
          console.log('결과 이미지 URL:', resultImageUrl);
          // 합성된 이미지 URL을 state에 저장
          setSynthesizedImageUrl(resultImageUrl);
        } else {
          console.error('이미지 합성 요청 실패');
        }
      } catch (error) {
        console.error('오류:', error);
      }
    }
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>지니 타임</p>
      <hr />

      <div className='body-container'>
      <p className='about-title' style={{ textAlign: 'center' }}>
      이미지를 업로드하여 헤어스타일 합성 결과를 확인해 보세요.<br /><br />
      <span style={{ display: 'inline-block', fontSize: '20px', fontWeight: 'bold' }}>
      1. 합성 원하는 사진 선택 &gt; 2. 헤어스타일 사진 선택 &gt; 3. 확인
      </span>
      </p>


        <div className='select-container'>
          <input
            type="file"
            accept="image/*"
            id="imageUpload1"
            style={{ display: 'none' }}
            onChange={handleImageSelect1}
          />

          <input
            type="file"
            accept="image/*"
            id="imageUpload2"
            style={{ display: 'none' }}
            onChange={handleImageSelect2}
          />

          {!isImage1Selected && (
            <label htmlFor="imageUpload1" className='select-btn'>
              <img src="/images/picture_icon.svg" alt="ImageUpload icon" className="camera-icon" />
              합성 원하는 사진
            </label>
          )}

          {isImage1Selected && !isImage2Selected && (
            <label htmlFor="imageUpload2" className='select-btn'>
              <img src="/images/picture_icon.svg" alt="ImageUpload icon" className="camera-icon" />
              원하는 헤어스타일 사진
            </label>
          )}

          {isImage2Selected && (
            <button className='select-btn' onClick={handleConfirmation}>
              확인
            </button>
          )}
        </div>

        {selectedImage1 && (
          <div className="selected-image-container">
            <img src={selectedImage1} alt="Selected Image 1" className="selected-image" />
          </div>
        )}

        {selectedImage2 && (
          <div className="selected-image-container">
            <img src={selectedImage2} alt="Selected Image 2" className="selected-image" />
          </div>
        )}
      </div>
    </div>
  );
}

export default HairSynthesisPage;
