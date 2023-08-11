import React from 'react'
import Nav from '../../components/Nav'
import './MyPage.css'

const MyPage = () => {
  return (
    <div className='mypage'>
      <Nav />
      <p>마이페이지</p>
      <hr className='separator' /> {/* 구분선을 추가하고 CSS 클래스를 지정 */}
    </div>
  )
}

export default MyPage