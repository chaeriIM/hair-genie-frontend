import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import axios from 'axios';

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccessPopupOpen, setLoginSuccessPopupOpen] = useState(false);
  const [loginFailPopupOpen, setLoginFailPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    const userData = {
      uid: userId,
      password,
    };

    // 데이터 전송 전에 userData를 콘솔에 출력
    console.log('전송하는 userData:', userData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/login/",
        JSON.stringify(userData), // JSON.stringify를 사용하여 JSON 형식으로 변환
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log('응답 데이터:', response.data);

      if (response.data.success) {
        // 로그인 성공 시 토큰을 localStorage에 저장
        localStorage.setItem('token', response.data.token);

        setLoginSuccessPopupOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setLoginFailPopupOpen(true);
        setErrorMessage(response.data.error);
        setTimeout(() => {
          setLoginFailPopupOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setLoginFailPopupOpen(true);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="body-container">
        <img
          src="/images/login-logo.svg"
          alt="logo"
          onClick={() => navigate("/")}
          className="login-logo"
        />
        <p>LOGIN</p>
        <form>
          <div className="login-form">
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
        <div className="caption">
          <Link className="list" to={"/findidpw"}>
            ID/PW 찾기
          </Link>
          <Link className="list" to={"/join"}>
            회원가입
          </Link>
        </div>
      </div>

      <Popup
        isOpen={loginSuccessPopupOpen}
        message="로그인이 완료되었습니다."
        isCompleted={true}
        onCancel={() => setLoginSuccessPopupOpen(false)}
      />

      <Popup
        isOpen={loginFailPopupOpen}
        message={errorMessage}
        isCompleted={true}
        onCancel={() => setLoginFailPopupOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
