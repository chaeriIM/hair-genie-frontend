import React from 'react'
import './Nav.css'

const Nav = () => {

  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    // 로그아웃 시 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    window.location.href = "/";
  }

  return (
    <div className='wrapper'>
      <img
        src="/images/logo.svg"
        alt="logo"
        onClick={() => (window.location.href = "/")}
        className='logo' />
      <span className="logo-text" onClick={() => (window.location.href = "/")}>Hair Genie</span>
      <div className='navbar'>
        <a href='/hairsynthesis' className='navbarMenu'>헤어스타일 합성</a>
        <a href='/faceshape' className='navbarMenu'>얼굴형 분석</a>
        <a href='/salonlocator' className='navbarMenu'>미용실 찾기</a>
        <a href='/salonreservation' className='navbarMenu'>미용실 예약</a>
        <a href='/mypage' className='navbarMenu'>마이페이지</a>

        {/* 로그인 여부에 따라 버튼 표시 */}
        {accessToken ? (
          <a href='/' className='navbarMenu btn' onClick={handleLogout}>로그아웃</a>
        ) : (
          <a href='/login' className='navbarMenu btn'>로그인</a>
        )}
      </div>
    </div>
  )
}

export default Nav