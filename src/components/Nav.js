import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
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
        <Link className='navbarMenu btn' to={'/login'}>로그인</Link>
      </div>
    </div>
  )
}

export default Nav