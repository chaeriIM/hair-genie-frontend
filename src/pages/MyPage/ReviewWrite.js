import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import '../../App.css';
import axios from 'axios';
import './ReviewWrite.css';
import Popup from '../../components/Popup'; 

const ReviewWrite = () => {
    const { id } = useParams();
    const minReviewLength = 10;
    const maxReviewLength = 400; 

    const [reviewText, setReviewText] = useState('');
    const [charCount, setCharCount] = useState(0); 
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false); 
    const [SubmitPopupOpen, setSubmitPopupOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState(''); 

    // 경고 시간
    useEffect(() => {
        if (warningMessage) {
            const timer = setTimeout(() => {
                setWarningMessage('');
            }, 800);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [warningMessage]);

    // 리뷰 등록
    const handleReviewSubmit = () => {
        if (charCount < minReviewLength) {
            setWarningMessage('10글자 이상 작성해 주세요.');
        } else if (charCount > maxReviewLength) {
            setWarningMessage('400글자 이하로 작성해 주세요.');
        } else {
            setSubmitPopupOpen(true);
        }
    };

    const handleConfirm = async () => {
        if (charCount < minReviewLength || charCount > maxReviewLength) {
            setWarningMessage(charCount < minReviewLength ? '10글자 이상 작성해 주세요.' : '400글자 이하로 작성해 주세요.');
            return;
        }

        try {
            // 예약 정보 가져오기
            const response = await axios.get(`http://127.0.0.1:8000/reservation/${id}`);
            const reservation = response.data;

            if (reservation) {
                const salonId = reservation.salon;
                const userId = reservation.customer;

                const reviewData = {
                    salon: salonId,
                    customer: userId,
                    reservation: id,
                    content: reviewText,
                };

                const reviewResponse = await axios.post(`http://127.0.0.1:8000/reservation/${salonId}/review/`, reviewData);

                if (reviewResponse.status === 201) {
                    // 리뷰 작성이 성공하면 예약 상태를 업데이트
                    await axios.put(`http://127.0.0.1:8000/reservation/${id}/review/`);
                    setIsReviewSubmitted(true); 
                    setTimeout(() => {
                        setSubmitPopupOpen(false);
                        window.location.href = `/reservation/${id}`;
                    }, 1000);
                } else {
                    console.error('리뷰 작성에 실패했습니다.');
                }
            } else {
                console.error('예약 정보를 가져오지 못했습니다.');
            }
        } catch (error) {
            console.error('서버와의 통신 중 오류 발생:', error);
        }
    };

    const handleReviewTextChange = (text) => {
        if (text.length <= maxReviewLength) {
            setReviewText(text);
            setCharCount(text.length);
            if (text.length >= minReviewLength) {
                setWarningMessage('');
            }
        } else {
            setWarningMessage('400글자 이하로 작성해 주세요.');
        }
    };

    return (
        <div className='review-write'>
            <Nav />
            <p className='main-title'>리뷰 쓰기</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='mypage-review-container'>
                    <textarea
                        className='review-textarea'
                        placeholder="10글자 이상 작성해주세요."
                        value={reviewText}
                        onChange={(e) => handleReviewTextChange(e.target.value)}
                    />
                    <p className="char-count">{charCount}/{maxReviewLength}</p>
                    <p className="warning-message">{warningMessage}</p>
                </div>
                <div className='review-write-bottom'>
                    <button onClick={handleReviewSubmit} className='login-btn' style={{ width: '100px' }}>등록하기</button>
                </div>
            </div>
            <Popup
                isOpen={SubmitPopupOpen}
                message={isReviewSubmitted ? '리뷰 작성 완료!' : '리뷰를 등록하시겠습니까?'}
                onConfirm={handleConfirm}
                onCancel={() => setSubmitPopupOpen(false)}
                isCompleted={isReviewSubmitted}
            />
        </div>
    );
};

export default ReviewWrite;
