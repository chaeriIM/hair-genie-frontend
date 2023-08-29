import React, { useState } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import '../../App.css';

const MyPage = () => {
  const Nickname = "Nickname";

  const navigate = useNavigate();
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [logoutCompletePopupOpen, setLogoutCompletePopupOpen] = useState(false);

  const profileImageUrl = null;

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
              <div className='nickname'> {Nickname} </div>
            </div>
          </div>
          <div className='mypage-button-section'>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/member-info-edit')}>회원 정보 수정  &gt;</div>
              <div className='bottom-button' onClick={() => handleButtonClick('/password-change')}>비밀번호 변경  &gt;</div>
              <div className='bottom-button' onClick={handleLogoutClick}>로그아웃  &gt;</div>
            </div>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/face-type-info')}>나의 얼굴형 타입  &gt;</div>
            </div>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/reservation-info')}>미용실 예약 정보  &gt;</div>
            </div>
          </div>
          <div className='bottom-button' onClick={() => handleButtonClick('/withdrawal')}>회원 탈퇴  &gt;</div>
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