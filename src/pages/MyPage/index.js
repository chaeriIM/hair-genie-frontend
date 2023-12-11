import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import './MyPage.css';
import '../../App.css';
import axios from 'axios';

const MyPage = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  const handleButtonClick = (path) => {
    navigate(path);
  };

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
      }
    };
    fetchUserInfo();

  }, []);

  return (
    <div className='mypage'>
      <Nav />
      <p className='main-title'>마이페이지</p>
      <Alert />
      <hr />
      <div className='body-container'>
        <div className='mypage-container'>
          <div className='profile-section'>
            <div className='mypage-profile'>
              <img
                src={`${user.profile_image}`}
                alt="Profile"
              />
              <div className='nickname-text'><span className='nickname'>{user.unickname}</span>님, 환영합니다.</div>
            </div>
          </div>
          <div className='mypage-button-section'>
            <div className='mypage-button-section-1'>
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
            <div className='mypage-button-section-2'>
              <div className='mypage-menu'>
                <div className='mypage-menu-button' onClick={() => handleButtonClick('/my-posts')}>내가 쓴 게시글  &#xE001;</div>
              </div>
              <div className='mypage-menu'>
                <div className='mypage-menu-button' onClick={() => handleButtonClick('/my-comments')}>내가 쓴 댓글  &#xE001;</div>
              </div>
              <div className='mypage-menu' style={{ border: 'transparent', boxShadow: 'none' }}></div>
            </div>
          </div>
          <div className='withdrawal-button' onClick={() => handleButtonClick('/withdrawal')}>회원 탈퇴  &#xE001;</div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;