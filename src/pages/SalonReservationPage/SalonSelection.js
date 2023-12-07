import React, { useEffect, useState } from 'react';
import './SalonSelection.css';
import SalonDetails from './SalonDetails';
import Pagination from 'react-js-pagination';
import Loading from '../../components/Loading';

const itemsPerPage = 10; // 페이지당 아이템 수

const SalonSelection = ({ onSelectSalon, currentStep, setStep }) => {
    const [salonData, setSalonData] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSalonDetails, setSelectedSalonDetails] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalonData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/hairsalon/');
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => a.HName.localeCompare(b.HName));
                    setSalonData(sortedData);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchSalonData();
    }, []);

    // SalonSelection 컴포넌트 내부에 useEffect 추가하여 미용실의 평균 별점 계산
    useEffect(() => {
        const fetchReviewDataForSalons = async () => {
            try {
                const salonsWithAvgRatings = await Promise.all(
                    salonData.map(async (salon) => {
                        const reviewResponse = await fetch(`http://127.0.0.1:8000/reservation/${salon.HID}/review`);
                        if (reviewResponse.ok) {
                            const reviewData = await reviewResponse.json();
                            const reviewCount = reviewData.length;
                            if (reviewCount > 0) {
                                const sum = reviewData.reduce((total, review) => total + review.rating, 0);
                                const averageRating = sum / reviewCount;
                                const roundedAvgRating = Math.round(averageRating * 10) / 10; // 소숫점 첫째 자리까지 반올림
                                return { ...salon, averageRating: roundedAvgRating, reviewCount };
                            }
                        }
                        return { ...salon, averageRating: 0, reviewCount: 0 }; // 리뷰가 없을 경우 기본값으로 0 설정 및 리뷰 개수 0으로 설정
                    })
                );
                setSalonData(salonsWithAvgRatings); // salonsWithAvgRatings로 설정
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchReviewDataForSalons();
    }, [salonData]);

    const handleSalonBoxClick = (salon) => {
        setSelectedSalonDetails(salon);
    };

    const handlePreviousClick = () => {
        setSelectedSalonDetails(null);
    };

    const handleReservationClick = () => {
        onSelectSalon(selectedSalonDetails);
        setStep(2);
    };

    const uniqueRegions = [...new Set(salonData.map((salon) => salon.HRegion))];

    useEffect(() => {
        const updateSearchResults = () => {
            const filteredSalons = salonData
                .filter((salon) => !selectedRegion || salon.HRegion === selectedRegion)
                .filter((salon) => salon.HName.toLowerCase().includes(searchKeyword.toLowerCase()));
            setSearchResults(filteredSalons);
        };

        updateSearchResults();
    }, [selectedRegion, searchKeyword, salonData]);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const indexOfLastSalon = activePage * itemsPerPage;
    const indexOfFirstSalon = indexOfLastSalon - itemsPerPage;
    const currentSalons = searchResults.slice(indexOfFirstSalon, indexOfLastSalon);

    return (
        <div className='body-container'>
            {!selectedSalonDetails && (
                <div className='Htop-container'>
                    <div className='region-selector'>
                        <select onChange={(e) => setSelectedRegion(e.target.value)}>
                            <option value="">전체</option>
                            {uniqueRegions.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='search-bar'>
                        <input
                            type='text'
                            placeholder='검색'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
            )}
            {selectedSalonDetails ? (
                <SalonDetails
                    salon={selectedSalonDetails}
                    onPrevious={handlePreviousClick}
                    onNext={handleReservationClick}
                />
            ) : (
                <div className='salon-box-container'>
                    {loading ? (
                        <Loading message='로딩 중' />
                    ) :
                        currentSalons.length === 0 ? (
                            <div className='no-results-message'>일치하는 검색 결과가 없습니다.</div>
                        ) : (
                            currentSalons.map((salon) => (
                                <div className='salon-box' key={salon.HID} onClick={() => handleSalonBoxClick(salon)}>
                                    <div className='salon-name'>{salon.HName}
                                        <div className='salon-selection-info'>
                                            {salon.reviewCount === 0 ? '등록된 리뷰가 없습니다.' : (
                                                <div className="star-rating">
                                                    {salon.averageRating !== undefined ? (
                                                        <>
                                                            <span>별점 {salon.averageRating.toFixed(1)}</span>
                                                            <span className="date-separator" style={{ color: "#e2e2e2" }}>|</span>
                                                            <span>리뷰 {salon.reviewCount}</span>
                                                        </>
                                                    ) : ''}
                                                </div>
                                            )}
                                            <div className='salon-selection-info'>{salon.HLoc}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    <div className='pagination-container'>
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={searchResults.length}
                            pageRangeDisplayed={5} // paginator의 페이지 범위
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePageChange}
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default SalonSelection;