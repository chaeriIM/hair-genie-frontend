import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './Alert.css';

const Alert = () => {
    const [showModal, setShowModal] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // 읽지 않은 알림 수

    const modalRef = useRef(null);

    //알림 열기/닫기
    const handleAlarmClick = () => {
        if (unreadCount > 0) {
            setShowModal(prevState => !prevState);
            setUnreadCount(0);
        }
    };

    const handleCloseModal = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        const handleClosingModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && showModal) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClosingModal);
        return () => {
            document.removeEventListener('mousedown', handleClosingModal);
        };
    }, [showModal]);

    useEffect(() => {
        document.addEventListener('mousedown', handleCloseModal);
        return () => {
            document.removeEventListener('mousedown', handleCloseModal);
        };
    }, []);

    useEffect(() => {
        const newAlerts = alerts.filter((alert, index) => index >= unreadCount);
        setUnreadCount(alerts.length);

        if (newAlerts.length > 0) {
            setShowModal(true);
        }
    }, [alerts.length, unreadCount, alerts]);

    //데이터 불러오기
    useEffect(() => {
        const userId = localStorage.getItem('userId');

        const fetchUserId = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://127.0.0.1:8000/user/`);
                    const userDataArray = response.data;

                    const matchedUser = userDataArray.find((user) => user.uid === userId);

                    if (matchedUser) {
                        const customerId = matchedUser.id;

                        const reservationsResponse = await axios.get(`http://127.0.0.1:8000/reservation/customer/${customerId}`);
                        const reservationsData = reservationsResponse.data;

                        const reservationsWithSalonNameAndServiceName = await Promise.all(
                            reservationsData.map(async (reservation) => {
                                const salonResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/${reservation.salon}`);
                                const salonName = salonResponse.data.HName;

                                const serviceResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/service/${reservation.service}`);
                                const serviceName = serviceResponse.data.service_name;
                                const menuName = serviceResponse.data.menu_name;
                                const status = reservation.status;

                                return {
                                    ...reservation,
                                    salonName,
                                    menuName,
                                    serviceName,
                                    status,
                                };
                            })
                        );

                        setReservations(reservationsWithSalonNameAndServiceName);
                    } else {
                        console.error('일치하는 사용자를 찾을 수 없습니다.');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserId();
    }, []);


    //알림 내용
    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        const allAlerts = [];

        reservations.forEach((reservation) => {
            const reservationDateTime = moment(`${reservation.date} ${reservation.time}`, 'YYYY-MM-DD HH:mm');

            const alertInfo = {
                reservation,
                formattedDate: '',
                alertComponent: null,
            };

            if (reservation.date === today && reservation.status === '예약 중' && reservationDateTime.isSameOrAfter(moment(), 'minute')) {
                alertInfo.formattedDate = '오늘';
                alertInfo.alertComponent = (
                    <div key={`today-${reservation.id}`} className='alarm-item'>
                        <Link to={`/reservation/${reservation.id}`} className='link-style'>
                            <div className='alert-icon'>
                                <img src="/images/scissors.svg" alt="scissors" className='scissors-icon' />
                            </div>
                            <div className='alert-content'>
                                <p className='alarm-title'>오늘은 <span className='alarm-salon-name'>{reservation.salonName}</span> <span className='blue-alarm'>방문일</span>입니다.</p>
                                <p className='alarm-source'>{reservation.date} {formatTime(reservation.time)}</p>
                                <p className='alarm-source'>[{reservation.menuName}] {reservation.serviceName}</p>
                            </div>
                        </Link>
                    </div>
                );
            } else if (reservation.status === '예약 중' && !reservationDateTime.isSameOrAfter(moment(), 'minute')) {
                const reservationDate = moment(reservation.date);
                const daysAgo = moment().diff(reservationDate, 'days');
                alertInfo.formattedDate = daysAgo > 0 ? `${daysAgo}일 전` : '오늘';
                alertInfo.alertComponent = (
                    <div key={`overdue-${reservation.id}`} className='alarm-item'>
                        <Link to={`/reservation/${reservation.id}`} className='link-style'>
                            <div className='alert-icon'>
                                <img src="/images/D-day.svg" alt="arrive" className='arrive-icon' />
                            </div>
                            <div className='alert-content'>
                                <p className='alarm-title'><span className='alarm-salon-name'>{reservation.salonName}</span> 방문에 만족하셨나요?  <span className='alarm-daysAgo'>{alertInfo.formattedDate}</span> </p>
                                <p className='alarm-source'>이용 완료 후에 리뷰를 남겨주세요.</p>
                            </div>
                        </Link>
                    </div>
                );
            } else if (reservation.status === '이용 완료') {
                const reservationDate = moment(reservation.date);
                const daysAgo = moment().diff(reservationDate, 'days');
                alertInfo.formattedDate = daysAgo > 0 ? `${daysAgo}일 전` : '오늘';
                alertInfo.alertComponent = (
                    <div key={`completed-${reservation.id}`} className='alarm-item'>
                        <Link to={`/reservation/${reservation.id}`} className='link-style'>
                            <div className='alert-icon'>
                                <img src="/images/review.svg" alt="review" className='review-icon' />
                            </div>
                            <div className='alert-content'>
                                <p className='alarm-title'>[리뷰 알림] <span className='alarm-salon-name'>{reservation.salonName}</span>{/* 에 방문해주셔서 감사합니다. */} <span className='alarm-daysAgo'>{alertInfo.formattedDate}</span></p>
                                <p className='alarm-source'>소중한 경험을 리뷰로 남겨주세요.</p>
                                <p className='alarm-source'>더 나은 서비스 제공과 다른 사용자들의 선택에 큰 도움이 됩니다.</p>
                            </div>
                        </Link>
                    </div>
                );
            }

            allAlerts.push(alertInfo);
        });

        allAlerts.sort((a, b) => {
            const dateA = moment(a.reservation.date, 'YYYY-MM-DD');
            const dateB = moment(b.reservation.date, 'YYYY-MM-DD');
            return dateB - dateA;
        });

        const sortedAlerts = allAlerts.map((alert) => alert.alertComponent).filter((component) => component !== null);

        setAlerts(sortedAlerts);
        setUnreadCount(sortedAlerts.length); // 읽지 않은 알림 수 업데이트
    }, [reservations]);


    // 시간을 오전/오후 형식으로 변환하는 함수
    const formatTime = (timeString) => {
        const time = new Date(`2000-01-01T${timeString}`);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${period} ${formattedHours}:${formattedMinutes}`;
    };

    // 최대 5개 항목만 출력하는 함수
    const getLimitedAlerts = () => {
        if (showAll) {
            return alerts;
        } else {
            return alerts.slice(0, 5);
        }
    };

    // '더보기' 버튼을 클릭했을 때의 핸들러
    const handleShowMore = () => {
        setShowAll(true);
    };

    return (
        <div>
            <div className='alarm-wrapper'>
                <div className="notification-icon">
                    {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                    <img src="/images/alarm.svg" alt="alarm" className='alarm' onClick={handleAlarmClick} />
                </div>
            </div>
            {showModal && unreadCount > 0 && (
                <div className='alarm-modal' ref={modalRef}>
                    <div className='alarm-navbar'>
                        <p>알림 &#xE001;</p>
                    </div>
                    <div className='alert-content'>
                        {alerts.length === 0 ? (
                            <p className="text-center">새로운 알림이 없습니다.</p>
                        ) : (
                            <ul>
                                {getLimitedAlerts().map((alert, index) => (
                                    <li key={index}>
                                        <div className='link-style'>
                                            {alert}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className='text-center'>
                            {alerts.length > 5 && !showAll && (
                                <button onClick={handleShowMore} className='show-more-btn'>더보기</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alert;