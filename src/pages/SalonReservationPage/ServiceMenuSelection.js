import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Popup from '../../components/Popup';
import './ServiceMenuSelection.css';

const ServiceMenuSelection = ({ selectedSalon, selectedDate, selectedTime, setStep }) => {
    const { HID, HName } = selectedSalon;
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [reservationCompleted, setReservationCompleted] = useState(false);
    const [menus, setMenus] = useState([]);
    const [menuServices, setMenuServices] = useState({});
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        setSelectedService(null);
    }, [selectedSalon, selectedDate, selectedTime]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/hairsalon/${HID}/service/`);
                if (response.ok) {
                    const data = await response.json();

                    // 모든 메뉴를 가져오기
                    const menuList = [...new Set(data.map((service) => service.menu_name))];
                    setMenus(menuList);

                    // 각 메뉴별로 서비스 목록을 그룹화
                    const menuServiceMap = {};
                    menuList.forEach((menu) => {
                        menuServiceMap[menu] = data.filter((service) => service.menu_name === menu);
                    });
                    setMenuServices(menuServiceMap);

                    // 첫 번째 메뉴를 기본으로 선택
                    if (menuList.length > 0) {
                        setSelectedMenu(menuList[0]);
                    }
                } else {
                    throw new Error('API 요청에 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (HID) {
            fetchMenu();
        }

        // 사용자 UID 가져오기
        const userId = localStorage.getItem('userId');
        console.log('사용자 UID:', userId);

        const fetchUserId = async () => {
            try {
                if (userId) {
                    // 백엔드 API를 호출하여 사용자 데이터를 가져옵니다.
                    const response = await axios.get(`http://127.0.0.1:8000/user/`);
                    const userDataArray = response.data;
                    console.log('사용자 데이터:', userDataArray);

                    // 'userId'와 일치하는 사용자 데이터 찾기
                    const matchedUser = userDataArray.find((user) => user.uid === userId);

                    if (matchedUser) {
                        // 사용자 데이터에서 ID 추출
                        const customerId = matchedUser.id;

                        // 추출한 ID를 상태 변수에 저장
                        setCustomerId(customerId);
                        console.log('사용자 ID:', customerId);
                    } else {
                        console.error('일치하는 사용자를 찾을 수 없습니다.');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserId();
    }, [HID]);


    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setSelectedService(null);
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    const handleConfirmClick = () => {
        setPopupOpen(true);
    };

    const handlePopupConfirm = async () => {
        try {
            /* const customerId = matchedUser.id; */
            const salonId = HID;
            const date = moment(selectedDate).format('YYYY-MM-DD');
            const time = selectedTime;
            const serviceId = selectedService.id;

            // 요청 데이터
            const requestData = {
                customer: customerId,
                salon: salonId,
                date: date,
                time: time,
                service: serviceId,
            };
            console.log('requestData:', requestData);

            // 백엔드로 POST 요청 보내기
            const response = await axios.post('http://127.0.0.1:8000/reservation/', requestData);

            if (response.status === 201) {
                setReservationCompleted(true);

                setTimeout(() => {
                    setPopupOpen(false);
                    window.location.href = '/';
                }, 800);
            } else {
                console.error('예약 생성 실패:', response.data);
            }
        } catch (error) {
            console.error('예약 생성 중 오류 발생:', error);
        }
    };


    const handlePopupCancel = () => {
        setPopupOpen(false);
    };

    return (
        <div className='body-container'>
            <div className="selected-salon-box">
                <p className="salon-name">{HName}</p>
                <div className="time-selected-date">{moment(selectedDate).format("MM월 DD일")}</div>
                <div className="selected-time">{moment(selectedTime, 'HH:mm').format('a h:mm')}</div>
            </div>
            <hr className="mini-separator" />
            <div className="menu-selection-container">
                <div className="menu-options">
                    {menus.map((menu) => (
                        <div
                            key={menu}
                            onClick={() => handleMenuClick(menu)}
                            className={`menu ${selectedMenu === menu ? 'selected' : ''}`}
                        >
                            {menu}
                        </div>
                    ))}
                </div>
                <div className="service-options">
                    {selectedMenu && menuServices[selectedMenu].map((service) => (
                        <div
                            key={service.id}
                            className={`service ${selectedService && selectedService.id === service.id ? 'selected' : ''}`}
                            onClick={() => handleServiceClick(service)}
                        >
                            <input
                                type="checkbox"
                                className={`service-checkbox ${selectedService && selectedService.id === service.id ? 'checked' : ''}`}
                                checked={selectedService && selectedService.id === service.id}
                                onChange={() => handleServiceClick(service)}
                            />
                            <span className={`service-name ${selectedService && selectedService.id === service.id ? 'selected' : ''}`}>{service.service_name}</span>
                            <span className={`service-price ${selectedService && selectedService.id === service.id ? 'selected' : ''}`}>{service.price}원</span>
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
                            : `${HName}에서 ${moment(selectedDate).format("MM월 DD일")} ${moment(selectedTime, 'HH:mm').format('a h:mm')}에 ${selectedService?.service_name || ''
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
