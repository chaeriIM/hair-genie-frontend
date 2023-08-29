import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../components/Nav';
import '../../App.css';
import './ReservationDetails.css'
import Kakaomap from '../../components/Kakaomap';

const ReservationDetails = () => {
    const { RNum } = useParams();

    const SampleReservationData = [
        {
            RNum: '00',
            salon: "00 미용실",
            location: "00 미용실 위치",
            date: '23. 3. 3',
            time: "10:00",
            service: "여자컷",
            isCancelled: false,
        },
        {
            RNum: '01',
            salon: "04 미용실",
            location: "04 미용실 위치",
            date: '23. 5. 10',
            time: "12:00",
            service: "컬러 3",
            isCancelled: false,
        },
        {
            RNum: '02',
            salon: "00 미용실",
            location: "00 미용실 위치",
            date: '23. 8. 29',
            time: "15:00",
            service: "클리닉 2",
            isCancelled: true, /* 임시로 예약 취소 설정 */
        },
    ];

    const reservation = SampleReservationData.find(res => res.RNum === RNum);

    return (
        <div>
            <Nav />
            <p className='main-title'>{reservation.salon}</p>
            <hr />
            <div className='body-container'>
                <div className='reservation-details-container'>
                    <div className={`D-reservation-box ${reservation.isCancelled ? 'cancelled' : ''}`}>
                        {reservation.isCancelled && <p className="DDR-title">취소된 예약</p>}
                        <p className="D-RNum">No.{reservation.RNum}</p>
                        <hr className="mypage-separator" />
                        <p className="D-menu">일정{' '} <span className="D-info">{reservation.date} {reservation.time}</span></p>
                        <p className="D-menu">메뉴{' '} <span className="D-info">{reservation.service}</span></p>
                        <hr className="mypage-separator" />
                        <p className="D-title">오시는 길
                            <hr className="mypage-separator" />
                            <Kakaomap /> <span className="D-info">📍 {reservation.location}</span></p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ReservationDetails;
