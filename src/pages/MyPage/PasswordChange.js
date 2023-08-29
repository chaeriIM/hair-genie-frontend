import React, { useState } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

// 비밀번호 임시로 지정
const PasswordChange = () => {
    const CurrentPassword = "password1234*";

    const [currentPassword, setCurrentPassword] = useState(CurrentPassword);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const [savePopupOpen, setSavePopupOpen] = useState(false);
    const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);

    const [passwordValidationStatus, setPasswordValidationStatus] = useState('');
    const [passwordConfirmValidationStatus, setPasswordConfirmValidationStatus] = useState('');

    const navigate = useNavigate();

    const handleSaveClick = () => {
        if (!areAllFieldsFilled) {
            setSavePopupOpen(true);
            return;
        }

        if (!isValidPassword(password)) {
            setPasswordValidationStatus('error');
            return;
        }
        setPasswordValidationStatus('success');

        if (password !== passwordConfirm) {
            setPasswordConfirmValidationStatus('error');
            return;
        }
        setPasswordConfirmValidationStatus('success');

        if (currentPassword !== password) {
            setIsPasswordChanged(true);
        }

        setSavePopupOpen(true);
    };

    const handleSaveConfirm = () => {
        setSavePopupOpen(false);
        setSaveCompletePopupOpen(true);

        setTimeout(() => {
            navigate('/mypage');
        }, 800);
    };

    const areAllFieldsFilled = currentPassword && password && passwordConfirm;

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()._-]).{8,20}$/;
        return passwordRegex.test(password);
    };

    return (
        <div>
            <Nav />
            <p className='main-title'>비밀번호 변경</p>
            <hr />
            <div className='body-container'>
                <div className='info-container'>
                    <div className={`info-row ${passwordValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='password'
                                placeholder='기존 비밀번호'
                                value={currentPassword}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setCurrentPassword(inputValue);
                                }}
                            />
                        </div>
                    </div>
                    <div className={`info-row ${passwordValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='password'
                                placeholder='새 비밀번호'
                                value={password}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setPassword(inputValue);
                                    setIsPasswordChanged(currentPassword !== inputValue);

                                    if (currentPassword === inputValue) {
                                        setPasswordValidationStatus('error');
                                    } else {
                                        setPasswordValidationStatus(isValidPassword(inputValue) ? 'success' : 'error');
                                    }
                                }}
                            />
                        </div>
                        {passwordValidationStatus === 'error' && (
                            <p className='error-message'>
                                {currentPassword === password
                                    ? "기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."
                                    : "영문/숫자/특수문자를 모두 사용하여 8글자 이상 입력하세요."}
                            </p>
                        )}
                    </div>
                    <div className={`info-row ${passwordConfirmValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='password'
                                placeholder='비밀번호 확인'
                                value={passwordConfirm}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setPasswordConfirm(inputValue);
                                    setPasswordConfirmValidationStatus(inputValue === password ? 'success' : 'error');
                                }}
                            />
                        </div>
                        {passwordConfirmValidationStatus === 'error' && (
                            <p className='error-message'>비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                    <div className='save-button'>
                        <button onClick={handleSaveClick} disabled={!areAllFieldsFilled || !isPasswordChanged}>저장하기</button>
                    </div>
                </div>
            </div>
            <Popup
                isOpen={savePopupOpen}
                message="비밀번호를 변경하시겠어요?"
                onConfirm={handleSaveConfirm}
                onCancel={() => setSavePopupOpen(false)}
            />
            <Popup
                isOpen={saveCompletePopupOpen}
                message="비밀번호가 변경되었습니다."
                isCompleted={true}
                onCancel={() => setSaveCompletePopupOpen(false)}
            />
        </div>
    );
};

export default PasswordChange;
