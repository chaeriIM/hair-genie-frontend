import React, { useState } from 'react';
import Nav from '../../components/Nav';
import ImageUpload from '../../components/ImageUpload';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Loading from '../../components/Loading';
import './HairSynthesisPage.css';

const UploadPage = () => {
  const [faceImage, setFaceImage] = useState('');
  const [hairstyleImage, setHairstyleImage] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFaceImageChange = (event) => {
    setFaceImage(event.target.files[0]);
  };

  const handleHairstyleImageChange = (event) => {
    setHairstyleImage(event.target.files[0]);
  };

  const handleSynthesis = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('faceImage', faceImage);
      formData.append('hairstyleImage', hairstyleImage);

      const response = await axios.post('http://127.0.0.1:8000/hairsynthesis/synthesis_hair', formData);
      
      localStorage.setItem('synthesis_image_url', response.data.synthesis_image_url);
      navigate("/synthesisresult");

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
        <ImageUpload onImageUploaded={handleFaceImageChange} label="얼굴 이미지 업로드" />
        <ImageUpload onImageUploaded={handleHairstyleImageChange} label="헤어스타일 이미지 업로드" />
        <button className='result-btn' onClick={handleSynthesis}>합성</button>
      </div>

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

      {loading && <Loading />}
    </div>
  );
};

export default UploadPage;
