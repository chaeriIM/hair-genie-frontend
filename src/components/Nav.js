import React from 'react'
import { Link } from 'react-router-dom'
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
        {/* <Link className='navbarMenu' to={'/'}>메인</Link> */}
        <Link className='navbarMenu' to={'/hairsynthesis'}>지니 타임</Link>
        <Link className='navbarMenu' to={'/faceshape'}>얼굴형 분석</Link>
        <Link className='navbarMenu' to={'/salonlocator'}>미용실 찾기</Link>
        <Link className='navbarMenu' to={'/salonreservation'}>미용실 예약</Link>
        <Link className='navbarMenu' to={'/mypage'}>마이페이지</Link>

        {/* 로그인 여부에 따라 버튼 표시 */}
        {accessToken ? (
          <Link className='navbarMenu btn' onClick={handleLogout}>로그아웃</Link>
        ) : (
          <Link className='navbarMenu btn' to={'/login'}>로그인</Link>
        )}
      </div>
    </div>
  )
}

export default Nav