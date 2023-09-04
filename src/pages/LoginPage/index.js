import React from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {

  return (
    <div className='body-container'>
      <div className="login">
        <img
          src="/images/login-logo.svg"
          alt="logo"
          onClick={() => (window.location.href = "/")}
          className="login-logo"
        />
        {/* <p onClick={() => (window.location.href = "/")}>LOGIN</p> */}
        <p>LOGIN</p>
        <div className="login-form">
          <input type='text' placeholder="아이디" />
          <input type='password' placeholder="비밀번호" />
          <button className="login-btn">로그인</button> {/* MyPage에 '로그아웃' 적었는데 로그인하면 바뀌게 해야할 듯 */}
        </div>
        <div className="caption">
          <Link className='list' to={'/findidpw'}>ID/PW 찾기</Link>
          <Link className='list' to={'/join'}>회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;