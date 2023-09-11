import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import '../../App.css';
import './ReservationInfo.css';

const SampleReservationData = [
    {
        RNum: '00',
        salon: "00 미용실",
        date: '23. 3. 3',
        time: "10:00",
        service: "여자컷",
        isCancelled: false,
    },
    {
        RNum: '01',
        salon: "04 미용실",
        date: '23. 5. 10',
        time: "12:00",
        service: "컬러 3",
        isCancelled: false,
    },
    {
        RNum: '02',
        salon: "00 미용실",
        date: '23. 8. 29',
        time: "15:00",
        service: "클리닉 2",
        isCancelled: true, /* 임시로 예약 취소 설정 */
    },
];

const ReservationInfo = () => {
    const [reservations] = useState(SampleReservationData);

    return (
        <div>
            <Nav />
            <p className='main-title'>미용실 예약 정보</p>
            <hr />
            <div className='body-container'>
                <div className='my-reservation-container'>
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.RNum}
                            className={`my-reservation-box ${reservation.isCancelled ? 'cancelled' : ''}`}>
                                <div className='my-reservation-box-top'>
{/*                                 <img src="/images/dryer_icon.svg" alt="dryer icon" class="dryer-icon" />
 */}                                <div className='my-reservation-box-info'>
                            <p className="my-salon-name">{reservation.salon}</p>
                            <p className="my-reservation-date">
                                {reservation.date} <span className="date-separator">|</span> {reservation.time}
                            </p>
                            </div>
                            </div>
                            <hr className="mypage-separator" />
                            <Link
                                to={`/reservation/${reservation.RNum}`}
                                className="my-reservation-service">
                                {reservation.service}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReservationInfo;