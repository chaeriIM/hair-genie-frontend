
import React, { useEffect, useState } from 'react';
import './SalonSelection.css';

const SalonSelection = ({ onSelectSalon, currentStep, setStep }) => {
    const [salonData, setSalonData] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchSalonData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/hairsalon/');
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => a.HName.localeCompare(b.HName));
                    setSalonData(sortedData);
                } else {
                    throw new Error('API 요청에 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSalonData();
    }, []);

    const handleReservationClick = (HID, HName, HLoc) => {
        const selectedSalon = { HID, HName, HLoc }; // 선택한 미용실의 정보를 객체로 저장
        onSelectSalon(selectedSalon);
        console.log('selectedSalon:', selectedSalon);

        setStep(2);
    };

    const uniqueRegions = [...new Set(salonData.map(salon => salon.HRegion))]; // 중복 제거된 지역 목록

    useEffect(() => {
        const updateSearchResults = () => {
            const filteredSalons = salonData
                .filter((salon) => !selectedRegion || salon.HRegion === selectedRegion)
                .filter((salon) => salon.HName.toLowerCase().includes(searchKeyword.toLowerCase()));

            setSearchResults(filteredSalons);
        };

        updateSearchResults();
    }, [selectedRegion, searchKeyword, salonData]);

    return (
        <div className='body-container'>
            <div className='Htop-container'>
                <div className='region-selector'>
                    <select onChange={(e) => setSelectedRegion(e.target.value)}>
                        <option value="">전체</option>
                        {uniqueRegions.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                <div className='search-bar'>
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
            </div>
            <div className='salon-box-container'>
                {searchResults.length === 0 ? (
                    <div className='no-results-message'>일치하는 검색 결과가 없습니다.</div>
                ) : (
                    searchResults.map((salon) => (
                        <div className='salon-box' key={salon.HID}>
                            <div className='salon-name'>{salon.HName} <div className='salon-location'>{salon.HLoc}</div></div>
                            {currentStep === 1 ? (
                                <div className='reservation-button' onClick={() => {
                                    handleReservationClick(salon.HID, salon.HName, salon.HLoc);
                                }}>예약</div>
                            ) : null}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SalonSelection;