import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Nav.css';
import axios from 'axios';
import Popup from './Popup';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tologinPopupOpen, setToLoginPopupOpen] = useState(false);

  useEffect(() => {
    // 페이지 로딩 시 로그인 상태 확인
    const token = localStorage.getItem('login-token');

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/user/logout/');
      if (response.data.success) {
        setIsLoggedIn(false);
        localStorage.removeItem('login-token'); 
        window.location.replace('/login');
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkClick = (linkName) => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우
      setToLoginPopupOpen(true);
      /* window.location.href = '/login'; */
      return;
    } /* else { */
    // 로그인된 경우: 원래 링크로 이동
    window.location.href = `/${linkName}`;
    /* } */
  };


  return (
    <div className='wrapper'>
      <img
        src="/images/logo.svg"
        alt="logo"
        onClick={() => (window.location.href = "/")}
        className='logo' />
      <span className="logo-text" onClick={() => (window.location.href = "/")}>Hair Genie</span>
      <div className='navbar'>
        <Link className='navbarMenu' to={'/hairsynthesis'} onClick={() => handleLinkClick('hairsynthesis')}>지니 타임</Link>
        <Link className='navbarMenu' to={'/faceshape'} onClick={() => handleLinkClick('faceshape')}>얼굴형 분석</Link>
        <Link className='navbarMenu' to={'/salonlocator'} onClick={() => handleLinkClick('salonlocator')}>미용실 찾기</Link>
        <Link className='navbarMenu' to={'/salonreservation'} onClick={() => handleLinkClick('salonreservation')}>미용실 예약</Link>
        <Link className='navbarMenu' to={'/mypage'} onClick={() => handleLinkClick('mypage')}>마이페이지</Link>
        {isLoggedIn ? (
          <button className='navbarMenu btn' onClick={handleLogout}>로그아웃</button>
        ) : (
          <Link className='navbarMenu btn' to={'/login'}>로그인</Link>
        )}
      </div>
      <Popup
        isOpen={tologinPopupOpen}
        message="로그인 후 이용해주세요."
        isCompleted={true}
        onCancel={() => setToLoginPopupOpen(false)}
      />
    </div>
  );
}

export default Nav;
