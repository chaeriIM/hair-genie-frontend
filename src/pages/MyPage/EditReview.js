import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import '../../App.css';
import axios from 'axios';
import './ReviewWrite.css';
import Popup from '../../components/Popup';

const EditReview = () => {
    const minReviewLength = 10; 
    const maxReviewLength = 400;

    const { id } = useParams();
    const [reviewId, setReviewId] = useState(null);
    const [review, setReview] = useState(null);
    const [reviewText, setReviewText] = useState('');

    const [loading, setLoading] = useState(true);
    const [warningMessage, setWarningMessage] = useState('');
    const [charCount, setCharCount] = useState(0);

    const [isReviewUpdated, setIsReviewUpdated] = useState(false);
    const [isReviewDeleted, setIsReviewDeleted] = useState(false);

    const [UpdatePopupOpen, setUpdatePopupOpen] = useState(false);
    const [DeletePopupOpen, setDeletePopupOpen] = useState(false);

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

    useEffect(() => {
        // 서버에서 예약 정보 가져오기
        axios.get(`http://127.0.0.1:8000/reservation/${id}/`)
            .then((reservationResponse) => {
                const reservation = reservationResponse.data;
                const hid = reservation.salon;

                // 리뷰 목록을 가져와서 예약과 연결된 리뷰 ID를 찾기
                axios.get(`http://127.0.0.1:8000/reservation/${hid}/review/`)
                    .then((reviewListResponse) => {
                        const reviewList = reviewListResponse.data;

                        // 예약과 연결된 리뷰 ID를 찾기
                        const review = reviewList.find((review) => review.reservation === reservation.id);
                        if (review) {
                            // 리뷰 ID를 직접 설정
                            setReviewId(review.review_number);

                            // 리뷰 ID로 리뷰 정보 가져오기
                            axios.get(`http://127.0.0.1:8000/reservation/review/${review.review_number}/`)
                                .then((reviewResponse) => {
                                    setReview(reviewResponse.data);
                                    setReviewText(reviewResponse.data.content);
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    console.error('리뷰 정보를 불러오는 중 오류 발생:', error);
                                    setLoading(false);
                                });
                        } else {
                            // 리뷰가 없는 경우
                        }
                    })
                    .catch((error) => {
                        console.error('리뷰 목록을 불러오는 중 오류 발생:', error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error('예약 정보를 불러오는 중 오류 발생:', error);
                setLoading(false);
            });
    }, [id, reviewId]);

    useEffect(() => {
        // 리뷰 텍스트의 실제 길이를 계산
        const textLength = reviewText.trim().length;
        setCharCount(textLength);
    }, [reviewText]);

    // 리뷰 업데이트
    const handleReviewUpdate = () => {
        if (charCount < minReviewLength) {
            setWarningMessage('10글자 이상 작성해주세요.');
        } else if (charCount > maxReviewLength) {
            setWarningMessage('400글자 이하로 작성해주세요.');
        } else {
            setUpdatePopupOpen(true);
        }
    };

    const confirmReviewUpdate = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/reservation/review/${reviewId}/update/`, { content: reviewText });

            if (response.status === 200) {
                setIsReviewUpdated(true);
                setTimeout(() => {
                    setUpdatePopupOpen(false);
                    window.location.href = `/reservation/${id}/`;
                }, 1000);
            } else {
                console.error('리뷰 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버와의 통신 중 오류 발생:', error);
        }
    };

    // 리뷰 삭제
    const handleReviewDelete = () => {
        setDeletePopupOpen(true);
    };

    const confirmReviewDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/reservation/review/${reviewId}/delete/`);
            if (response.status === 204) {
                setIsReviewDeleted(true);

                setTimeout(() => {
                    setDeletePopupOpen(false);
                    window.location.href = `/reservation/${id}`;
                }, 1000);
            } else {
                console.error('리뷰 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버와의 통신 중 오류 발생:', error);
        }
    };

    if (loading) {
        return <p> </p>;
    }

    if (!review) {
        return <p>리뷰 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className='review-edit'>
            <Nav />
            <p className='main-title'>내가 작성한 리뷰</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='mypage-review-container'>
                    <textarea
                        className='review-textarea'
                        placeholder="10글자 이상 작성해주세요."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <p className="char-count">{charCount}/{maxReviewLength}</p>
                    <p className="warning-message">{warningMessage}</p>
                </div>
                <div className='review-write-bottom'>
                    <button onClick={handleReviewUpdate} className='login-btn' style={{ width: '100px', marginRight: '0' }}>수정하기</button>
                    <button onClick={handleReviewDelete} className='login-btn' style={{ width: '100px' }}>삭제하기</button>
                </div>
            </div>
            <Popup
                isOpen={UpdatePopupOpen}
                message={isReviewUpdated ? '리뷰 수정 완료!' : '리뷰를 수정하시겠습니까?'}
                onConfirm={confirmReviewUpdate}
                onCancel={() => setUpdatePopupOpen(false)}
                isCompleted={isReviewUpdated}
            />
            <Popup
                isOpen={DeletePopupOpen}
                message={isReviewDeleted ? '리뷰가 삭제되었습니다.' : '리뷰를 삭제하시겠습니까?'}
                onConfirm={confirmReviewDelete}
                onCancel={() => setDeletePopupOpen(false)}
                isCompleted={isReviewDeleted}
            />
        </div >
    );
};

export default EditReview;