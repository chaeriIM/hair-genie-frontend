import React, { useEffect, useState } from 'react';
import './SalonDetails.css';
import Pagination from 'react-js-pagination';

const itemsPerPage = 5;

const SalonDetails = ({ salon, onPrevious, onNext }) => {
    const [reviews, setReviews] = useState([]);
    const [activePage, setActivePage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const reviewResponse = await fetch(`http://127.0.0.1:8000/reservation/${salon.HID}/review`);
                if (reviewResponse.ok) {
                    const reviewData = await reviewResponse.json();

                    // 리뷰 데이터로 상태 업데이트
                    setReviews(reviewData);

                    // 리뷰 데이터에서 사용자 정보 가져오기
                    const userInfoPromises = reviewData.map(async (review) => {
                        const userInfoResponse = await fetch(`http://127.0.0.1:8000/user/${review.customer}`);
                        if (userInfoResponse.ok) {
                            const userInfo = await userInfoResponse.json();
                            return userInfo;
                        } else {
                            return null;
                        }
                    });

                    // Promise.all로 모든 사용자 정보 가져오기
                    const userInfos = await Promise.all(userInfoPromises);

                    // 리뷰 데이터에 사용자 정보 삽입
                    setReviews((prevReviews) =>
                        prevReviews.map((review, index) => ({
                            ...review,
                            customer: {
                                ...review.customer,
                                unickname: userInfos[index]?.unickname,
                                profile_image: userInfos[index]?.profile_image,
                            },
                        }))
                    );
                } else {
                    throw new Error('리뷰 불러오기 실패');
                }
            } catch (error) {
                console.error('오류:', error);
            }
        };

        fetchReviewData();
    }, [salon.HID]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 2자리로 패딩
        const day = date.getDate().toString().padStart(2, '0'); // 일자를 2자리로 패딩
        return `${year}.${month}.${day}`;
    };

    const indexOfLastReview = activePage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
        <div className='body-container'>
            <div className='Dtop-container'>
                <button className='cricle-button' onClick={onPrevious}>&#xE000;</button>
            </div>
            <div className='salon-details-box'>
                <div className='salon-details-box-top'>
                    <p className="salon-name">{salon.HName}</p>
                    <button className='mini-button' onClick={onNext}>예약</button>
                </div>
                <hr className='mypage-separator' />
                <p className='salon-loc'>
                    <img src='/images/location_icon.svg' alt='location icon' className='location_icon' />
                    {salon.HLoc}
                </p>
                <hr className='mypage-separator' />
                <p className='review-title'>리뷰 ({reviews.length})</p>
                <div className='review-list-box'>
                    {currentReviews.length === 0 ? (
                        <p className="no-review-text">등록된 리뷰가 없습니다.</p>
                    ) : (
                        currentReviews.map((review) => (
                            <div key={review.review_number} className='review-item'>
                                <div className='review-profile'>
                                    <img src={review.customer.profile_image} alt='Profile' />
                                    <p className='reviewer-info'>{review.customer.unickname}<br />{formatDate(review.created_at)}</p>
                                </div>
                                <div className='review-content'>
                                    <p>{review.content}</p>
                                    <hr className='mypage-separator' />
                                </div>
                            </div>
                        )))}
                </div>
                {reviews.length > itemsPerPage && (
                    <div className='pagination-container'>
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={reviews.length}
                            pageRangeDisplayed={5}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalonDetails;
