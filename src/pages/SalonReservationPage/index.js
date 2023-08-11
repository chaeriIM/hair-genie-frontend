import React from 'react'
import Nav from '../../components/Nav'
import './SalonReservationPage.css'

const SalonReservationPage = () => {
  return (
    <div className='salonreservation'>
      <Nav />
      <p>미용실 예약</p>
      <hr className='separator' /> {/* 구분선을 추가하고 CSS 클래스를 지정 */}
    </div>
  )
}

export default SalonReservationPage