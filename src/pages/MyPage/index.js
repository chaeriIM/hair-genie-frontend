import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../../components/Nav';
/* import Popup from '../../components/Popup'; */
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import '../../App.css';

const MyPage = () => {
  const Nickname = "Nickname";

  const [image, setImage] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );

  const navigate = useNavigate();
/*   const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [logoutCompletePopupOpen, setLogoutCompletePopupOpen] = useState(false); */

  const handleButtonClick = (path) => {
    navigate(path);
  };

  /* const handleLogoutClick = () => {
    setLogoutPopupOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutPopupOpen(false);
    setLogoutCompletePopupOpen(true);

    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  }; */

  const location = useLocation();
  const updatedImage = location.state?.updatedImage || image;

  if (updatedImage !== image) {
    setImage(updatedImage);
  }

  return (
    <div className='mypage'>
      <Nav />
      <p className='main-title'>마이페이지</p>
      <hr />
      <div className='body-container'>
        <div className='mypage-container'>
          <div className='profile-section'>
            <div className='mypage-profile'>
              <div>
                <img
                  src={updatedImage}
                  alt="Profile"
                  style={{ width: '120px', height: '120px' }}
                />
              </div>
              <div className='nickname-text'><span className='nickname'>{Nickname}</span>님, 환영합니다.</div>
            </div>
          </div>
          <div className='mypage-button-section'>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/member-info-edit')}>회원 정보 수정  &#xE001;</div>
              <div className='bottom-button' onClick={() => handleButtonClick('/password-change')}>비밀번호 변경  &#xE001;</div>
              {/* <div className='bottom-button' onClick={handleLogoutClick}>로그아웃  &#xE001;</div> */}
            </div>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/face-type-info')}>나의 얼굴형 타입  &#xE001;</div>
            </div>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/reservation-info')}>미용실 예약 정보  &#xE001;</div>
            </div>
          </div>
          <div className='withdrawal-button' onClick={() => handleButtonClick('/withdrawal')}>회원 탈퇴  &#xE001;</div>
        </div>
      </div>
      {/* <Popup
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
      /> */}
    </div>
  );
};

export default MyPage;