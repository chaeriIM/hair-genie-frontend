import React, { useState } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import '../../App.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [logoutCompletePopupOpen, setLogoutCompletePopupOpen] = useState(false);

  const profileImageUrl = null; // 프로필 이미지가 없는 상황

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutPopupOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutPopupOpen(false);
    setLogoutCompletePopupOpen(true);

    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className='mypage'>
      <Nav />
      <p className='main-title'>마이페이지</p>
      <hr />
      <div className='body-container'>
        <div className='mypage-container'>
          <div className='profile-section'>
            <div className='mypage-profile'>
              <div className='mypage-profile-image'>
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="프로필 이미지" />
                ) : (
                  <div className='empty-profile'>
                    프로필 이미지가 없습니다.
                  </div>
                )}
              </div>
              <div className='user-name'>
                사용자 이름
              </div>
            </div>
          </div>
          <div className='button-section'>
            <div className='button' onClick={() => handleButtonClick('/member-info-edit')}>
              <span>회원 정보 수정</span>
              <div className='button-icon'>&gt;</div>
            </div>
            <div className='button' onClick={() => handleButtonClick('/face-type-info')}>
              <span>나의 얼굴형 타입</span>
              <div className='button-icon'>&gt;</div>
            </div>
            <div className='button' onClick={() => handleButtonClick('/reservation-info')}>
              <span>미용실 예약 정보</span>
              <div className='button-icon'>&gt;</div>
            </div>
            <div className='button' onClick={handleLogoutClick}>
              <span>로그아웃</span>
              <div className='button-icon'>&gt;</div>
            </div>
          </div>
          <div className='leave-button' onClick={() => handleButtonClick('/withdrawal')}>
            <span className='leave-button-text'>회원 탈퇴</span>
            <span className='leave-button-icon'>&gt;</span>
          </div>
        </div>
      </div>
      <Popup
        isOpen={logoutPopupOpen}
        message="로그아웃 하시겠어요?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutPopupOpen(false)}
      />
      <Popup
        isOpen={logoutCompletePopupOpen}
        message="로그아웃 되었습니다."
        isCompleted={true}
        onCancel={() => setLogoutCompletePopupOpen(false)}
      />
    </div>
  );
};

export default MyPage;