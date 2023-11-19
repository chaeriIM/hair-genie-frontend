/*global kakao*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import '../../App.css';
import './ReservationDetails.css'
import moment from 'moment';

const ReservationDetails = () => {
    const { id } = useParams();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelCompleted, setCancelCompleted] = useState(false);
    const [reservationCompleted, setReservationCompleted] = useState(false);

    const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
    const [completePopupOpen, setCompletePopupOpen] = useState(false);

    const [name, setName] = useState(null);
    const [loc, setLoc] = useState(null);

    useEffect(() => {
        // 서버에서 예약 정보 가져오기
        axios.get(`http://127.0.0.1:8000/reservation/${id}`)
            .then(async (response) => {
                // 예약 정보를 상태에 설정
                const reservationData = response.data;
                const status = response.data.status;

                // 예약에 관련된 미용실 정보 가져오기
                const salonResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/${reservationData.salon}`);
                const HName = salonResponse.data.HName;
                setName(HName);
                const HLoc = salonResponse.data.HLoc;
                setLoc(HLoc);

                // 예약에 관련된 서비스 정보 가져오기
                const serviceResponse = await axios.get(`http://127.0.0.1:8000/hairsalon/service/${reservationData.service}`);
                const serviceName = serviceResponse.data.service_name;
                const price = serviceResponse.data.price;

                const reservationWithDetails = {
                    ...reservationData,
                    HName,
                    HLoc,
                    serviceName,
                    price,
                    status,
                };

                setReservation(reservationWithDetails);
                setLoading(false);
            })
            .catch((error) => {
                console.error('예약 정보를 불러오는 중 오류 발생:', error);
                setLoading(false);
            });
    
        const initializeMap = () => {
            const geocoder = new kakao.maps.services.Geocoder();
    
            if (loc) {
                geocoder.addressSearch(loc, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const salonLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);
    
                        const mapContainer = document.getElementById('map');
                        const mapOption = {
                            center: salonLatLng,
                            level: 3
                        };
                        const map = new kakao.maps.Map(mapContainer, mapOption);
                        
                        const mapTypeControl = new kakao.maps.MapTypeControl();
                        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    
                        const zoomControl = new kakao.maps.ZoomControl();
                        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);  
    
                        const markerImage = new kakao.maps.MarkerImage(
                            '/images/salonicon.png', new kakao.maps.Size(48, 48));
    
                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: salonLatLng,
                            image: markerImage
                        });
    
                        const infowindow = new kakao.maps.InfoWindow({
                            content:
                                `<div style="width:150px;text-align:center;padding:6px 0;font-size:14px">
                                    <strong>${name}</strong>
                                </div>`
                        });
                        infowindow.open(map, marker);
    
                        map.setCenter(salonLatLng);
                    }
                });
            }
        }

        initializeMap();

            
    }, [id, loc, name]); // id가 변경될 때마다 호출

    const isReservationTimeInPast = () => {
        if (reservation) {
            const currentDateTime = moment();
            const reservationDateTime = moment(`${reservation.date} ${reservation.time}`, 'YYYY-MM-DD HH:mm');
            return reservationDateTime.isBefore(currentDateTime);
        }
        return false;
    };

    // 예약 취소 
    const handleCancelClick = () => {
        setCancelPopupOpen(true);
    };

    const handlePopupConfirm = async () => {
        try {
            if (reservation) {
                // 예약이 '예약 중' 상태인 경우에만 취소 요청
                if (reservation.status === '예약 중') {
                    setCancelCompleted(true);
                    await axios.put(`http://127.0.0.1:8000/reservation/${reservation.id}/cancel/`);
                    setReservation({ ...reservation, status: '예약 취소' });
                    setTimeout(() => {
                        setCancelPopupOpen(false);
                    }, 1000);
                } else {
                    alert('이미 취소된 예약입니다.');
                }
            }
        } catch (error) {
            console.error('예약 취소 중 오류 발생:', error);
            alert('예약 취소 중 오류가 발생했습니다.');
        }
    };

    //이용 완료
    const handleCompleteClick = () => {
        setCompletePopupOpen(true);
    };

    const handleCompleteConfirmation = async () => {
        if (reservation.status === '예약 중' && isReservationTimeInPast()) {
            try {
                setReservationCompleted(true);
                const response = await axios.put(`http://127.0.0.1:8000/reservation/${reservation.id}/complete/`);
                if (response.status === 200) {
                    setReservation({ ...reservation, status: '이용 완료' });
                    setTimeout(() => {
                        setCompletePopupOpen(false);
                    }, 1000);
                } else {
                    console.error('예약 상태 업데이트에 실패했습니다.');
                }
            } catch (error) {
                console.error('예약 상태 업데이트 중 오류 발생:', error);
                alert('예약 상태 업데이트 중 오류가 발생했습니다.');
            }
        } else {
            alert('이용 완료할 수 없는 예약입니다.');
        }
    };

    if (loading) {
        return (
            <div>
                <Nav />
                <p className='main-title'> </p>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div>
                <Nav />
                <p className='main-title'>예약 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    //리뷰 작성
    const handleReviewClick = () => {
        window.location.href = `/review/${reservation.id}`;
    };

    // 리뷰 수정
    const handleReviewEditClick = () => {
        window.location.href = `/review/${reservation.id}/edit`;
    };

    return (
        <div>
            <Nav />
            <p className='main-title'>{reservation?.HName}</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='reservation-details-container'>
                    <div className={`D-reservation-box ${reservation?.status === '예약 취소' ? 'cancelled' : ''}`}>
                        {reservation?.status === '예약 취소' && <p className="DDR-title">취소된 예약</p>}
                        {(reservation?.status === '이용 완료' || reservation?.status === '리뷰 작성 완료') && <p className="DDR-title">이용 완료</p>}
                        <p className="D-RNum">No.{reservation?.id}</p>
                        <hr className="mypage-separator" />
                        <p className="D-menu">일정{' '} <span className="D-info">{reservation?.date} {moment(reservation?.time, 'HH:mm').format('a h:mm')}</span></p>
                        <p className="D-menu">메뉴{' '} <span className="D-info">{reservation?.serviceName} {parseInt(reservation?.price).toLocaleString()}원</span></p>
                        {reservation?.status === '예약 중' && !isReservationTimeInPast() && (
                            <button className="Rstatus-button" onClick={handleCancelClick}>예약 취소</button>
                        )}
                        {reservation?.status === '예약 중' && isReservationTimeInPast() && (
                            <button className="Rstatus-button" onClick={handleCompleteClick}>이용 완료</button>
                        )}
                        {reservation?.status === '이용 완료' && (
                            <button className="Rstatus-button" onClick={handleReviewClick}>리뷰 쓰기</button>
                        )}
                        {reservation?.status === '리뷰 작성 완료' && (
                            <button className="Rstatus-button" onClick={handleReviewEditClick}>내가 작성한 리뷰</button>
                        )}
                        <hr className="mypage-separator" />
                        <div className='map-container'>
                            <p className='D-title'>찾아 오는 길</p>
                            <div id="map" style={{ width: '100%', height: '350px' }}></div>
                        </div>
                        <p className="L-info">
                            <img src="/images/location_icon.svg" alt="location icon" className="location_icon" />
                            {reservation?.HLoc}
                        </p>
                        <Popup
                            isOpen={cancelPopupOpen}
                            message={
                                cancelCompleted
                                    ? '예약이 취소되었습니다.'
                                    : `예약 취소 후에는 복구할 수 없습니다.`
                            }
                            onConfirm={handlePopupConfirm}
                            onCancel={() => setCancelPopupOpen(false)}
                            isCompleted={cancelCompleted}
                        />
                        <Popup
                            isOpen={completePopupOpen}
                            message={
                                reservationCompleted
                                    ? '이용 완료되었습니다.'
                                    : '서비스를 받아보셨다면 이용 완료해 주세요.'
                            }
                            onConfirm={handleCompleteConfirmation}
                            onCancel={() => setCompletePopupOpen(false)}
                            isCompleted={reservationCompleted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetails;
