import React from 'react';

const LoginPage = () => {
  const handleJoinClick = () => {
    window.location.href = "join";
  };

  return (
    <div>
      <div className='wrapper'>
        <img
          src="/images/logo.svg"
          alt="logo"
          onClick={() => (window.location.href = "/")}
          className='logo'
        />
      </div>
      <button onClick={handleJoinClick}>회원가입</button> {/* 회원가입가는 길이 없어서 임시로 만듬 */}
      LoginPage
    </div>
  );
};

export default LoginPage;