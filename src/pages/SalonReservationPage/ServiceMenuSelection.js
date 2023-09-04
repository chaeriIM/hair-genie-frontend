import React, { useState } from 'react';
import moment from 'moment';
import Popup from '../../components/Popup';
import './ServiceMenuSelection.css';

const ServiceMenuSelection = ({ selectedSalon, selectedDate, selectedTime }) => {
    const [selectedMenu, setSelectedMenu] = useState('컷');
    const [selectedService, setSelectedService] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [reservationCompleted, setReservationCompleted] = useState(false);

    const menus = ['컷', '펌', '컬러', '클리닉'];
    const services = {
        컷: [
            { name: '남자컷', price: 10000 },
            { name: '여자컷', price: 10000 },
            { name: '앞머리 컷', price: 10000 },
            { name: '컷 4', price: 10000 }],
        펌: [
            { name: '펌 1', price: 10000 },
            { name: '펌 2', price: 10000 },
            { name: '펌 3', price: 10000 },
            { name: '펌 4', price: 10000 }],
        컬러: [
            { name: '컬러 1', price: 10000 },
            { name: '컬러 2', price: 10000 },
            { name: '컬러 3', price: 10000 },
            { name: '컬러 4', price: 10000 }],
        클리닉: [
            { name: '클리닉 1', price: 10000 },
            { name: '클리닉 2', price: 10000 },
            { name: '클리닉 3', price: 10000 },
            { name: '클리닉 4', price: 10000 }],
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setSelectedService(null);
    };

    const handleServiceClick = (service) => {
        setSelectedService(selectedService === service ? null : service);
    };

    const handleConfirmClick = () => {
        setPopupOpen(true);
    };

    const handlePopupConfirm = () => {
        setReservationCompleted(true);

        setTimeout(() => {
            setPopupOpen(false);
            window.location.href = "/";
        }, 800);
    };

    const handlePopupCancel = () => {
        setPopupOpen(false);
    };

    return (
        <div className='body-container'>
            <div className="selected-salon-box">
                <p className="salon-name">{selectedSalon}</p>
                <div className="time-selected-date">{moment(selectedDate).format("MM월 DD일")}</div>
                <div className="selected-time">{selectedTime}</div>
            </div>
            <hr className="mini-separator" />
            <div className="menu-selection-container">
                <div className="menu-options">
                    {menus.map((menu) => (
                        <div key={menu} onClick={() => handleMenuClick(menu)} className={`menu ${selectedMenu === menu ? 'selected' : ''}`}>
                            {menu}
                        </div>
                    ))}
                </div>
                <div className="service-options">
                    {services[selectedMenu].map((service) => (
                        <div
                            key={service.name}
                            className={`service ${selectedService && selectedService.name === service.name ? 'selected' : ''}`}
                            onClick={() => handleServiceClick(service)}
                        >
                            <input
                                type="checkbox"
                                className={`service-checkbox ${selectedService && selectedService.name === service.name ? 'checked' : ''}`}
                                checked={selectedService && selectedService.name === service.name}
                                onChange={() => handleServiceClick(service)}                        
                            />
                            <span className={`service-name ${selectedService && selectedService.name === service.name ? 'selected' : ''}`}>{service.name}</span>
                            <span className={`service-price ${selectedService && selectedService.name === service.name ? 'selected' : ''}`}>{service.price}원</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleConfirmClick} className={`confirm-button ${selectedService ? 'active' : ''}`} disabled={!selectedService}>
                    예약
                </button>
                <Popup
                    isOpen={popupOpen}
                    message={
                        reservationCompleted
                            ? '예약이 완료되었습니다.'
                            : `${selectedSalon}-${moment(selectedDate).format("MM월 DD일")} ${selectedTime}, ${selectedService?.name || ''
                            }(으)로 예약을 진행할까요?`
                    }
                    onConfirm={handlePopupConfirm}
                    onCancel={handlePopupCancel}
                    isCompleted={reservationCompleted}
                />
            </div>
        </div >
    );
};

export default ServiceMenuSelection;
