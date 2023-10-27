import React, { useState } from 'react';
import Webcam from '../../components/Webcam';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import Modal from 'react-modal';
import Loading from '../../components/Loading';

const WebcamPage = () => {

  const [value, setValue] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleanalyze = async () => {
    // console.log(value);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', value, "capture-image.jpg");

      const response = await axios.post('http://127.0.0.1:8000/faceshape/analyze_face/',
      formData
    );
      localStorage.setItem('predictions', JSON.stringify(response.data.predictions));
      localStorage.setItem('cropped_face_url', response.data.cropped_face_url);
      navigate("/faceresult");

    } catch (error) {
      console.error('얼굴형 분석 실패:', error);
      setErrorModalOpen(true);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <hr />

      <div className='body-container'>
        {loading ? (
          <Loading message='얼굴형 분석 중' />
        ): (
          <>
            <Webcam setValue={setValue} />
            {value && (
              <div className='container'>
                <button className='result-btn' onClick={handleanalyze}>분석</button>
              </div>
            )}
          </>
        )}
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
            <p>얼굴형이 잘 보이는 정면 사진을 업로드해 주세요.</p>
          </div>
        </Modal>

    </div>
  )
}

export default WebcamPage