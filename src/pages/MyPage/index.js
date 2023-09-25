import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import './MyPage.css';
import '../../App.css';
import axios from 'axios';
import Popup from '../../components/Popup';

const MyPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState([]);
  const [image, setImage] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [loginErrorPopupOpen, setLoginErrorPopupOpen] = useState(false);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const updatedImage = location.state?.updatedImage || image;

  if (updatedImage !== image) {
    setImage(updatedImage);
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get('http://127.0.0.1:8000/user/info/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰 포함
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다.', error);
        setLoginErrorPopupOpen(true);

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    };
    fetchUserInfo();

  }, [navigate]);

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
              <div className='nickname-text'><span className='nickname'>{user.unickname}</span>님, 환영합니다.</div>
            </div>
          </div>
          <div className='mypage-button-section'>
            <div className='mypage-menu'>
              <div className='mypage-menu-button' onClick={() => handleButtonClick('/member-info-edit')}>회원 정보 수정  &#xE001;</div>
              <div className='bottom-button' onClick={() => handleButtonClick('/password-change')}>비밀번호 변경  &#xE001;</div>
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

      <Popup
        isOpen={loginErrorPopupOpen}
        message="로그인 후 이용해 주세요."
        isCompleted={true}
        onCancel={() => setLoginErrorPopupOpen(false)}
      />

    </div>
  );
};

export default MyPage;