import React, { useEffect, useState } from 'react';
import Popup from '../../components/Popup';
import axios from 'axios';
import '../../App.css';
import './Withdrawal.css'

const Withdrawal = () => {
    const [user, setUser] = useState([]);
    const [password, setPassword] = useState('');
   
    const [WithdrawalPopupOpen, setWithdrawalPopupOpen] = useState(false);
    const [WithdrawalCompletePopupOpen, setWithdrawalCompletePopupOpen] = useState(false);
    const [ErrorPopupOpen, setErrorPopupOpen] = useState(false);

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.get("http://127.0.0.1:8000/user/info/", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰 포함
            },
            });

            setUser(response.data);

        } catch (error) {
            console.error("사용자 정보를 가져오는데 실패했습니다.", error);
        }
        };
        fetchUserInfo();
    }, []);

    // 탈퇴
    const WithDrawal = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.delete('http://127.0.0.1:8000/user/delete_account/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    password: password,
                },
            });

            console.log("회원 탈퇴 성공", response.data);
            setWithdrawalCompletePopupOpen(true);

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            console.error("회원 탈퇴 실패", error);

            if (error.response) {
                if (error.response.status === 400) {
                    console.error("회원 탈퇴 실패: ", error.response.data.message);
                    setErrorPopupOpen(true);

                    setPassword('');

                    setTimeout(() => {
                        setErrorPopupOpen(false);
                    }, 1200);
                }
            }
        }
    }

    // 탈퇴 버튼 클릭
    const handleWithdrawalClick = () => {
        setWithdrawalPopupOpen(true);
    };

    // 팝업창에서 확인 버튼 클릭
    const handleWithdrawalConfirm = () => {
        setWithdrawalPopupOpen(false);
        WithDrawal();
    };

    return (
        <div className='withdrawal'>
            <div className='body-container'>
            <img src="/images/trash_bin_icon.svg" alt="trash bin icon" className="trash_bin_icon" />
                <p className='withdrawal-title'>회원 탈퇴</p>
                <div className='info-container'>
                    <p className='withdrawal-description'>회원 탈퇴 시 계정은 삭제되며 복구되지 않습니다.</p>
                    <div className='info-row'>
                        <div className="info-input-container">
                            <input
                                type='text'
                                value={user.uid || ''}
                                readOnly
                                style={{ backgroundColor: "#b4d1ed" }}
                            />
                        </div>
                    </div>
                    <div className="info-input-container">
                        <input
                            type='password'
                            placeholder='비밀번호'
                            value={password}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setPassword(inputValue);
                            }}
                        />
                    </div>
                    <div className='withdrawal-button'>
                        <button onClick={handleWithdrawalClick} disabled={!password}>탈퇴하기</button>
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
            <Popup
                isOpen={ErrorPopupOpen}
                message="비밀번호가 일치하지 않습니다."
                isCompleted={true}
                onCancel={() => setErrorPopupOpen(false)}
            />
        </div>
    );
};

export default Withdrawal;