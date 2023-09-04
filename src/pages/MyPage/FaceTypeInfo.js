import React from 'react';
import Nav from '../../components/Nav';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './FaceTypeInfo.css'

const FaceTypeInfo = () => {
    const navigate = useNavigate();

    const navigateToResult = (selectedType) => {
        navigate('/my-face-type', { state: { selectedType } });
    };

    const navigateToFaceShapePage = () => {
        navigate('../faceshape');
    };

    return (
        <div>
            <Nav />
            <p className='main-title'>나의 얼굴형 타입</p>
            <hr />
            <div className='myfacetype'>
            <div className='body-container'>
            <img src="/images/check_glass_icon.svg" alt="face check icon" class="face-check-icon" />
                <p className='FT-title'>나의 얼굴형을 선택하고 추천 스타일을 확인해 보세요!</p>
                <div className='FT-button-container'>
                    <button class="MFT-button" onClick={() => navigateToResult('Heart')}>하트형 (Heart)</button>
                    <br />
                    <button class="MFT-button" onClick={() => navigateToResult('Oval')}>계란형 (Oval)</button>
                    <br />
                    <button class="MFT-button" onClick={() => navigateToResult('Round')}>둥근형 (Round)</button>
                    <br />
                    <button class="MFT-button" onClick={() => navigateToResult('Square')}>각진형 (Square)</button>
                    <br />
                    <button class="MFT-button" onClick={() => navigateToResult('Oblong')}>긴 얼굴형 (Oblong)</button>
                    <br />
                </div>
                <p className='FT-link' onClick={navigateToFaceShapePage}>나의 얼굴형 타입을 알고 싶으면 여기를 클릭하세요.</p>
            </div>
        </div>
        </div>
    );
};

export default FaceTypeInfo;