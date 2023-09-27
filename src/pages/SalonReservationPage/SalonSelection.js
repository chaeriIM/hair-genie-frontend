import React, { useEffect, useState } from 'react';
import './SalonSelection.css';

const SalonSelection = ({ onSelectSalon, currentStep, setStep }) => {
    const handleReservationClick = (selectedSalonName, HID, HName, HLoc) => {
        const selectedSalon = { HID, HName, HLoc }; // 선택한 미용실의 정보를 객체로 저장
        onSelectSalon(selectedSalon);
        setStep(2); // 스텝을 2로 변경하여 DateSelection 컴포넌트로 전환
    };

    const [salonData, setSalonData] = useState([]);

    useEffect(() => {
        const fetchSalonData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/hairsalon/');
                if (response.ok) {
                    const data = await response.json();
                    setSalonData(data);
                } else {
                    throw new Error('API 요청에 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSalonData();
    }, []);

    return (
        <div className='body-container'>
            <div className='salon-box-container'>
                {salonData.map((salon) => (
                    <div className='salon-box' key={salon.HID}>
                        <div className='salon-name'>{salon.HName} <div className='salon-location'>{salon.HLoc}</div></div>
                        {currentStep === 1 ? (
                            <div className='reservation-button' onClick={() => {
                                console.log('Selected Salon:', salon.HID, salon.HName, salon.HLoc);
                                handleReservationClick(salon.HName, salon.HID, salon.HName, salon.HLoc); 
                            }}>예약</div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div >
    );
};

export default SalonSelection;
