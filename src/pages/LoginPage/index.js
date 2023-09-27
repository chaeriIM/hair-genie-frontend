import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from '../../components/Popup';
import Modal from 'react-modal';

const LoginPage = () => {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');

  const [loginCompletePopupOpen, setLoginCompletePopupOpen] = useState(false);
  const [loginErrorPopupOpen, setLoginErrorPopupOpen] = useState(false);

  const navigate = useNavigate();

  const clearErrors = () => {
    setIdError('');
    setPwError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    if (!userId) {
      setIdError('아이디를 입력해주세요.');
      hasError = true;
    }
    if (!password) {
      setPwError('비밀번호를 입력해주세요.');
      hasError = true;
    }

    if (!hasError) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/user/token/', {
          uid: userId,
          password: password,
        });
        console.log("로그인 성공", response.data);
        setLoginCompletePopupOpen(true);

        localStorage.setItem('userId', userId);
  
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
  
        setTimeout(() => {
          navigate('/');
        }, 1500);
  
      } catch (error) {
        console.error("로그인 실패", error);
        setLoginErrorPopupOpen(true);
      }
    }

  }

  return (
    <div className='login'>
      <div className="body-container">
        <img
          src="/images/login-logo.svg"
          alt="logo"
          onClick={() => (window.location.href = "/")}
          className="login-logo"
        />
        {/* <p onClick={() => (window.location.href = "/")}>LOGIN</p> */}
        <p className="login-title">LOGIN</p>
        <div className="login-form">
          <input 
            type='text' 
            placeholder="아이디" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          {idError && <p className='error-msg'>{idError}</p>}
          <input 
            type='password' 
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {pwError && <p className='error-msg'>{pwError}</p>}
          <button className="login-btn" onClick={handleSubmit}>로그인</button>
        </div>
        <div className="caption">
          <Link className='list' to={'/findidpw'}>ID/PW 찾기</Link>
          <Link className='list' to={'/join'}>회원가입</Link>
        </div>
      </div>

      <Popup
        isOpen={loginCompletePopupOpen}
        message="로그인이 완료되었습니다."
        isCompleted={true}
        onCancel={() => setLoginCompletePopupOpen(false)}
      />

      <Modal
          isOpen={loginErrorPopupOpen}
          onRequestClose={() => setLoginErrorPopupOpen(false)}
          contentLabel="에러 모달"
          className="modal"
          overlayClassName="overlay"
          ariaHideApp={false}
        >
          <div className="modal-header">
            <h2>🚫 에러</h2>
            <button className="close-button" onClick={() => setLoginErrorPopupOpen(false)}>
              X
            </button>
          </div>
          <div className="modal-content">
            <p>아이디 또는 비밀번호가 올바르지 않습니다.</p>
            <p>다시 확인해주세요.</p>
          </div>
        </Modal>

    </div>
  );
};

export default LoginPage;