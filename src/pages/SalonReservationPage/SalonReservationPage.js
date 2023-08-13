import React, { useState } from 'react';
import Nav from '../../components/Nav';
import SalonSelection from './SalonSelection';
import DateSelection from './DateSelection';
import ServiceMenuSelection from './ServiceMenuSelection';
import './SalonReservationPage.css';

const SalonReservationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleSelectSalon = (salonName) => {
    setSelectedSalon(salonName);
    setStep(2);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <SalonSelection onSelectSalon={handleSelectSalon} currentStep={step} setStep={setStep} />;
      case 2:
        return (
          <DateSelection
            selectedSalon={selectedSalon}
            setStep={setStep}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
          />
        );
      case 3:
        return (
          <ServiceMenuSelection
            selectedSalon={selectedSalon}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setStep={setStep} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='salonreservation'>
      <Nav />
      <p>미용실 예약</p>
      <hr className='separator' />
      <div className='step-indicator'>
        <div className={`step ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
          <div className='step-circle'>1</div>
          미용실 선택
        </div>
        <span className='step-divider'>{'>'}</span>
        <div className={`step ${step === 2 ? 'active' : ''}`} onClick={() => step >= 2 && setStep(2)}>
          <div className='step-circle'>2</div>
          날짜 선택
        </div>
        <span className='step-divider'>{'>'}</span>
        <div className={`step ${step === 3 ? 'active' : ''}`} onClick={() => step >= 3 && setStep(3)}>
          <div className='step-circle'>3</div>
          시술 메뉴 선택
        </div>
      </div>

      {/* 각 단계에 따라 다른 컴포넌트 출력 */}
      {renderStepContent()}
    </div>
  );
}

export default SalonReservationPage;
