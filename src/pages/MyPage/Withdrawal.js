import React, { useState } from 'react';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './Withdrawal.css'

const Withdrawal = () => {
    const userId = "UserId";
    const CurrentPassword = "password1234*";

    const [currentPassword] = useState(CurrentPassword);
    const [password, setPassword] = useState('');
    const [passwordValidationStatus, setPasswordValidationStatus] = useState('');

    const [WithdrawalPopupOpen, setWithdrawalPopupOpen] = useState(false);
    const [WithdrawalCompletePopupOpen, setWithdrawalCompletePopupOpen] = useState(false);

    const navigate = useNavigate();

    const handleWithdrawalClick = () => {
        if (currentPassword !== password) {
            setPasswordValidationStatus('error');
            return;
        }
        setWithdrawalPopupOpen(true);
    };

    const handleWithdrawalConfirm = () => {
        setWithdrawalPopupOpen(false);
        setWithdrawalCompletePopupOpen(true);
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <div className='withdrawal'>
            <div className='body-container'>
            <img src="/images/trash_bin_icon.svg" alt="trash bin icon" class="trash_bin_icon" />
                <p className='withdrawal-title'>회원 탈퇴</p>
                <div className='info-container'>
                    <p className='withdrawal-description'>회원 탈퇴 시 계정은 삭제되며 복구되지 않습니다.</p>
                    <div className='info-row'>
                        <div className="info-input-container">
                            <input
                                type='text'
                                value={userId}
                                readOnly
                                style={{ backgroundColor: "#b4d1ed" }}
                            />
                        </div>
                    </div>
                    <div className={`info-row ${passwordValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='password'
                                placeholder='비밀번호'
                                value={password}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setPassword(inputValue);
                                    setPasswordValidationStatus(currentPassword !== inputValue ? 'error' : '');
                                }}
                            />
                        </div>
                        {passwordValidationStatus === 'error' && (
                            <p className='error-message'>
                                비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                    </div>
                    <div className='withdrawal-button'>
                        <button onClick={handleWithdrawalClick} disabled={currentPassword !== password}>탈퇴하기</button>
                    </div>
                </div>
            </div>
            <Popup
                isOpen={WithdrawalPopupOpen}
                message="정말 탈퇴하시겠어요?"
                onConfirm={handleWithdrawalConfirm}
                onCancel={() => setWithdrawalPopupOpen(false)}
            />
            <Popup
                isOpen={WithdrawalCompletePopupOpen}
                message="회원탈퇴가 완료되었습니다."
                isCompleted={true}
                onCancel={() => setWithdrawalCompletePopupOpen(false)}
            />
        </div >
    );
};

export default Withdrawal;
