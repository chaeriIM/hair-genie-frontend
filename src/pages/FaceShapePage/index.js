import React from 'react'
import Nav from '../../components/Nav'
import './FaceShapePage.css'

const FaceShapePage = () => {
  return (
    <div className='faceshape'>
      <Nav />
      <p>얼굴형 분석</p>
      <hr className='separator' /> {/* 구분선을 추가하고 CSS 클래스를 지정 */}
    </div>
  )
}

export default FaceShapePage