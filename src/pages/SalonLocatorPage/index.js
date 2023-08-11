import React from 'react'
import Nav from '../../components/Nav'
import './SalonLocatorPage.css'

const SalonLocatorPage = () => {
  return (
    <div className='salonlocator'>
      <Nav />
      <p>주변 미용실 찾기</p>
      <hr className='separator' /> {/* 구분선을 추가하고 CSS 클래스를 지정 */}
    </div>
  )
}

export default SalonLocatorPage
