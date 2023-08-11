import React, { useState } from 'react';
import Nav from '../../components/Nav';
import './SalonReservationPage.css';

const SalonReservationPage = () => {
  const [step, setStep] = useState(1); // 현재 단계를 관리할 상태 변수

  return (
    <div className='salonreservation'>
      <Nav />
      <p>미용실 예약</p>
      <hr className='separator' />

      {/* 상단 바에 단계 표시 */}
      <div className='step-indicator'>
        <div className={`step ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
          <div className='step-circle'>1</div>
          미용실 선택
        </div>
        <span className='step-divider'>{'>'}</span>
        <div className={`step ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
          <div className='step-circle'>2</div>
          날짜 선택
        </div>
        <span className='step-divider'>{'>'}</span>
        <div className={`step ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
          <div className='step-circle'>3</div>
          시술 메뉴 선택
        </div>
      </div>
    </div>
  );
}

export default SalonReservationPage;

