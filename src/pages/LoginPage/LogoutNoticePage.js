import React from "react";
import './LogoutNoticePage.css';

const LogoutNoticePage = () => {
    const handleConfirmation = () => {
        window.location.href = "/login";
    };

    return (
        <div className="logout-notice">
            <div className="body-container">
                <div className="lon-box">
                    <div className="lon-title">이용시간이 경과되었습니다.</div>
                    <p className="lon-text">
                        장시간 미사용으로 자동 로그아웃되었습니다.<br/>
                        다시 로그인해 주세요.
                    </p>
                    <button onClick={handleConfirmation} className="lon-btn">확인</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutNoticePage;