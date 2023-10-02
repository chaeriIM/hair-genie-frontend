import React, { useState } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

const PasswordChange = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);
    const [saveErrorPopupOpen, setSaveErrorPopupOpen] = useState(false);

    const [passwordValidationStatus, setPasswordValidationStatus] = useState('');
    const [passwordConfirmValidationStatus, setPasswordConfirmValidationStatus] = useState('');

    const navigate = useNavigate();

    const handleSaveClick = async () => {
        // if (!areAllFieldsFilled) {
        //     return;
        // }

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

        try {
            const accessToken = localStorage.getItem("accessToken");
            const updatedUserPw = {
                current_password: currentPassword,
                new_password: password,
            };
            const response = await axios.put('http://127.0.0.1:8000/user/change_password/',
                updatedUserPw,
                {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                
            console.log("비밀번호 변경 성공", response.data);
            setIsPasswordChanged(true);
            setSaveCompletePopupOpen(true);

            setTimeout(() => {
                navigate('/mypage');
            }, 800);

        } catch (error) {
            console.error("비밀번호 변경 실패", error);

            if (error.response) {
                if(error.response.status === 400) {
                    console.error("비밀번호 변경 실패: ", error.response.data.message);
                    setSaveErrorPopupOpen(true);

                    setCurrentPassword('');
                    setPassword('');
                    setPasswordConfirm('');
                    setPasswordValidationStatus('');
                    setPasswordConfirmValidationStatus('');

                    setTimeout(() => {
                        setSaveErrorPopupOpen(false);
                    }, 1200);
                }
            }
            
        }
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
                    <p className='password-C-description'>
                    <img src="/images/password_icon.svg" alt="lock icon" className="lock-icon" />
                    현재 비밀번호를 입력한 후 <br/>새로 사용할 비밀번호를 입력해주세요.</p>
                    <div className={`info-row ${passwordValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='password'
                                placeholder='기존 비밀번호'
                                value={currentPassword}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setCurrentPassword(inputValue);
                                    setIsPasswordChanged(password !== inputValue);
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
                isOpen={saveCompletePopupOpen}
                message="비밀번호가 변경되었습니다."
                isCompleted={true}
                onCancel={() => setSaveCompletePopupOpen(false)}
            />
            <Popup
                isOpen={saveErrorPopupOpen}
                message="기존 비밀번호가 일치하지 않습니다."
                isCompleted={true}
                onCancel={() => setSaveErrorPopupOpen(false)}
            />
        </div>
    );
};

export default PasswordChange;
