import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import '../../App.css';
import './ReservationInfo.css';
import moment from 'moment';
import Pagination from 'react-js-pagination';

const itemsPerPage = 5;

const ReservationInfo = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('사용자 UID:', userId);

        const fetchUserId = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://127.0.0.1:8000/user/`);
                    const userDataArray = response.data;
                    console.log('사용자 데이터:', userDataArray);

                    // 'userId'와 일치하는 사용자 데이터 찾기
                    const matchedUser = userDataArray.find((user) => user.uid === userId);

                    if (matchedUser) {
                        // 사용자 데이터에서 ID 추출
                        const customerId = matchedUser.id;

                        // customerId를 사용하여 해당 사용자의 예약 정보를 불러오는 API 요청
                        axios.get(`http://127.0.0.1:8000/reservation/customer/${customerId}`)
                            .then(async (response) => {
                                // 예약 목록을 불러온 후, 예약 상태를 '예약 취소'인 경우 'Cancelled'로 변환
                                const reservationsWithSalonNameAndServiceName = await Promise.all(
                                    response.data.map(async (reservation) => {
                                        const salonResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/${reservation.salon}`);
                                        const salonName = salonResponse.data.HName;

                                        const serviceResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/service/${reservation.service}`);
                                        const serviceName = serviceResponse.data.service_name;
                                        const status = reservation.status === '예약 취소' ? 'Cancelled' : reservation.status;

                                        return {
                                            ...reservation,
                                            salonName,
                                            serviceName,
                                            status,
                                        };
                                    })
                                );
                                setReservations(reservationsWithSalonNameAndServiceName);
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error('예약 정보를 불러오는 중 오류 발생:', error);
                                setLoading(false);
                            });
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

    // 전체 페이지의 예약 목록 계산 (날짜와 시간을 기준으로 최신순 정렬)
    const sortedReservations = [...reservations].sort((a, b) => {
        const dateA = moment(a.date + ' ' + a.time, 'YYYY-MM-DD HH:mm');
        const dateB = moment(b.date + ' ' + b.time, 'YYYY-MM-DD HH:mm');
        return dateB - dateA;
    });

    const indexOfLastReservation = currentPage * itemsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
    const currentReservations = sortedReservations.slice(indexOfFirstReservation, indexOfLastReservation);

    // 페이지 변경 이벤트 처리
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Nav />
            <p className='main-title'>미용실 예약 정보</p>
            <hr />
            <div className='body-container'>
                <div className='my-reservation-container'>
                    {loading ? (
                        <p> </p>
                    ) : reservations.length === 0 ? (
                        <div className='no-reservation-container'>
                            <img src="/images/shopping_cart_icon.svg" alt="shopping cart icon" className="shopping_cart_icon" />
                            <p className='no-reservation'>미용실 예약 정보가 없습니다.</p>
                        </div>
                    ) : (
                        currentReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className={`my-reservation-box ${reservation.status === 'Cancelled' ? 'cancelled' : ''}`}
                            >
                                <div className='my-reservation-box-top'>
                                    <div className='my-reservation-box-info'>
                                        <p className="my-salon-name">{reservation.salonName}</p>
                                        <p className="my-reservation-date">
                                            {reservation.date} <span className="date-separator">|</span> {moment(reservation.time, 'HH:mm').format('a h:mm')}
                                        </p>
                                    </div>
                                </div>
                                <hr className="mypage-separator" />
                                <Link
                                    to={`/reservation/${reservation.id}`}
                                    className="my-reservation-service"
                                >
                                    {reservation.serviceName}
                                </Link>
                            </div>
                        ))
                    )}
                    {reservations.length > itemsPerPage && (
                        <div className='pagination-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={reservations.length}
                                pageRangeDisplayed={5}
                                prevPageText={"‹"}
                                nextPageText={"›"}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationInfo;
