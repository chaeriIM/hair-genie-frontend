import React, { useState } from 'react';
import moment from 'moment';
import './ServiceMenuSelection.css';

const ServiceMenuSelection = ({ selectedSalon, selectedDate, selectedTime }) => {
    const [selectedMenu, setSelectedMenu] = useState('컷'); // 기본값으로 '컷' 메뉴 선택
    const [selectedService, setSelectedService] = useState(null);

    const menus = ['컷', '펌', '컬러', '클리닉'];
    const services = {
        컷: [
            { name: '남자컷', price: 10000 },
            { name: '여자컷', price: 10000 },
            { name: '앞머리 컷', price: 10000 },
            { name: '컷 4', price: 10000 }
        ],
        펌: [
            { name: '펌 1', price: 10000 },
            { name: '펌 2', price: 10000 },
            { name: '펌 3', price: 10000 },
            { name: '펌 4', price: 10000 }
        ],
        컬러: [
            { name: '컬러 1', price: 10000 },
            { name: '컬러 2', price: 10000 },
            { name: '컬러 3', price: 10000 },
            { name: '컬러 4', price: 10000 }
        ],
        클리닉: [
            { name: '클리닉 1', price: 10000 },
            { name: '클리닉 2', price: 10000 },
            { name: '클리닉 3', price: 10000 },
            { name: '클리닉 4', price: 10000 }
        ],
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setSelectedService(null);
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    const handleConfirmClick = () => {
        // 여기서 선택된 메뉴와 서비스 정보를 이용하여 예약 등 필요한 작업 수행
        console.log('예약 확인:', selectedMenu, selectedService);
    };

    const isButtonDisabled = !selectedService; // Determine if the button should be disabled

    return (
        <div>
            <div className="selected-salon-box">
                <p className="selected-salon-text">{selectedSalon}</p>
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

                {selectedMenu && (
                    <div className="service-options">
                        {services[selectedMenu].map((service) => (
                            <label key={service.name} className={`service ${selectedService === service ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="service"
                                    value={service.name}
                                    checked={selectedService === service}
                                    onChange={() => handleServiceClick(service)}
                                />
                                <span className="service-name">{service.name}</span>
                                <span className="service-price">{service.price}원</span>
                            </label>
                        ))}
                    </div>
                )}

                <button onClick={handleConfirmClick} className="confirm-button" disabled={isButtonDisabled}>
                    예약
                </button>
            </div>
        </div>
    );
};

export default ServiceMenuSelection;
