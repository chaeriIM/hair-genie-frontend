
import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import FaceShapePage from './pages/FaceShapePage';
import HairSynthesisPage from './pages/HairSynthesisPage';
import SalonLocatorPage from './pages/SalonLocatorPage';
import SalonReservationPage from './pages/SalonReservationPage/SalonReservationPage';
import MyPage from './pages/MyPage/index.js';
import MemberInfoEdit from './pages/MyPage/MemberInfoEdit';
import PasswordChange from './pages/MyPage/PasswordChange';
import FaceTypeInfo from './pages/MyPage/FaceTypeInfo';
import MyFaceType from './pages/MyPage/MyFaceType';
import ReservationInfo from './pages/MyPage/ReservationInfo';
import ReservationDetails from './pages/MyPage/ReservationDetails';
import Withdrawal from './pages/MyPage/Withdrawal';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage'
import FaceResultPage from './pages/FaceShapePage/FaceResultPage';
import HairResultPage from './pages/HairSynthesisPage/HairResultPage';
import FaceUploadPage from './pages/FaceShapePage/UploadPage';
import FaceWebcamPage from './pages/FaceShapePage/WebcamPage';
import HairUploadPage from './pages/HairSynthesisPage/UploadPage';
import HairWebcamPage from './pages/HairSynthesisPage/WebcamPage';
import FindIdPwPage from './pages/LoginPage/FindIdPwPage';
import NewPwPage from "./pages/LoginPage/NewPwPage";
import LogoutNoticePage from "./pages/LoginPage/LogoutNoticePage";

import Modal from 'react-modal';
Modal.setAppElement('#root')

const App = () => {
  const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  };

  const checkTokenExpiration = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const tokenData = JSON.parse(atob(accessToken.split(".")[1])); // 디코딩하여 토큰 데이터 추출
      const expirationTime = tokenData.exp * 1000; // 토큰 만료 시간(밀리초) - 유닉스 타임스탬프

      // 현재 시간(밀리초)
      const currentTime = new Date().getTime();

      // 토큰 만료 여부 확인
      if (expirationTime < currentTime) {
        // 토큰이 만료되었을 경우 로그아웃 로직을 수행
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/logout-notice";
      }
    }
  };

  // 페이지 로드 시 토큰 만료 여부 확인
  checkTokenExpiration();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="join" element={<JoinPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="findidpw" element={<FindIdPwPage />} />
        <Route path="/user/reset/:uidb64/:token/" element={<NewPwPage />} />
        <Route path="logout-notice" element={<LogoutNoticePage />} />

        {/* 로그인 후에만 접근 가능한 페이지 */}
        {isLoggedIn() ? (
          <>
            <Route path="hairsynthesis" element={<HairSynthesisPage />} />
            <Route path="faceshape" element={<FaceShapePage />} />
            <Route path="salonlocator" element={<SalonLocatorPage />} />
            <Route path="salonreservation" element={<SalonReservationPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="member-info-edit" element={<MemberInfoEdit />} />
            <Route path="password-change" element={<PasswordChange />} />
            <Route path="face-type-info" element={<FaceTypeInfo />} />
            <Route path="my-face-type" element={<MyFaceType />} />
            <Route path="reservation-info" element={<ReservationInfo />} />
            <Route path="/reservation/:id" element={<ReservationDetails />} />
            <Route path="withdrawal" element={<Withdrawal />} />
            <Route path="faceresult" element={<FaceResultPage />} />
            <Route path="face-uploadpage" element={<FaceUploadPage />} />
            <Route path="face-webcampage" element={<FaceWebcamPage />} />
            <Route path="hairresult" element={<HairResultPage />} />
            <Route path="hair-uploadpage" element={<HairUploadPage />} />
            <Route path="hair-webcampage" element={<HairWebcamPage />} />
          </>
        ) : (
          // 로그인이 필요한 페이지에 접근할 때 표시할 팝업
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
};

export default App;