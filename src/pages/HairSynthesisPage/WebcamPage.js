import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Webcam from '../../components/Webcam';
import ImageUpload from '../../components/ImageUpload';
import axios from 'axios';
import './HairSynthesisPage.css';
import '../../App.css';
import Modal from 'react-modal';
import Loading from '../../components/Loading';

const UploadPage = () => {
  const [faceImage, setFaceImage] = useState('');
  const [hairstyleImage, setHairstyleImage] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFaceImage = (image) => {
    setFaceImage(image);
  };
  const handleHairstyleImage = (image) => {
    setHairstyleImage(image);
  };

  const handleSynthesis = async () => {
    // console.log('faceimg', faceImage);
    // console.log('hairimg', hairstyleImage);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('faceImage', faceImage, "faceImage.jpg");
      formData.append('hairstyleImage', hairstyleImage, "hairstyleImage.jpg");

      const response = await axios.post('http://127.0.0.1:8000/hairsynthesis/hair_synthesis/',
        formData
      );
      localStorage.setItem('hair_synthesis_result', response.data.hair_synthesis_result);
      navigate("/hairresult");
    
    } catch (error) {
      console.error('헤어스타일 합성 실패:', error);
      setErrorModalOpen(true);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='hairsynthesis'>
      <Nav />
      <p className='main-title'>헤어스타일 합성</p>
      <hr />

      <div className='body-container'>
        {loading ? (
          <Loading message='헤어스타일 합성 중' />
        ): (
          <>
            <Webcam setValue={handleFaceImage} />
            <div>
              <p className='img-notice'>✧ 헤어스타일 사진 ✧</p>
              <ImageUpload setValue={handleHairstyleImage} inputId="HairstyleImage" />
            </div>
            {faceImage &&  (
              <div className='container'>
                <button className='result-btn' onClick={handleSynthesis}>합성</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 합성 실패 시 에러 모달 표시 */}
      <Modal
        isOpen={errorModalOpen}
        onRequestClose={() => setErrorModalOpen(false)}
        contentLabel="에러 모달"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h2>🚫 에러</h2>
          <button className="close-button" onClick={() => setErrorModalOpen(false)}>
            X
          </button>
        </div>
        <div className="modal-content">
          <p>헤어스타일 합성에 실패했습니다. 다시 시도해 주세요.</p>
        </div>
      </Modal>
    </div>
  )
}

export default UploadPage