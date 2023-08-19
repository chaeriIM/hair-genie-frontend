import React from 'react';
import './SalonSelection.css';

const SalonSelection = ({ onSelectSalon, currentStep, setStep }) => {
    const handleReservationClick = (selectedSalon) => {
        onSelectSalon(selectedSalon);
        setStep(2); // 스텝을 2로 변경하여 DateSelection 컴포넌트로 전환
    };

    const salonData = [
        { id: '00', name: '00미용실' },
        { id: '01', name: '01미용실' },
        { id: '02', name: '02미용실' },
        { id: '03', name: '03미용실' },
        { id: '04', name: '04미용실' },
        { id: '05', name: '05미용실' }
    ];

    return (
        <div className='salon-selection-container'>
            {salonData.map((salon, index) => (
                <React.Fragment key={salon.id}>
                    {/*{index === 0 && <div className='distance-label'>거리 순</div>}*/}
                    <div className='salon-container'>
                        <div className='salon-box'>
                            <div className='salon-name'>{salon.name}</div>
                            {currentStep === 1 ? (
                                <div className='reservation-button' onClick={() => handleReservationClick(salon.name)}>예약</div>
                            ) : null}
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default SalonSelection;
