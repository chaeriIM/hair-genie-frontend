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

import Modal from 'react-modal';
import NewPwPage from "./pages/LoginPage/NewPwPage";
Modal.setAppElement('#root')

const App = () => {
  const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="join" element={<JoinPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="findidpw" element={<FindIdPwPage />} />
        <Route path="/user/reset/:uidb64/:token/" element={<NewPwPage />} />
        {/* 로그인 후에만 접근 가능한 페이지 */}
        
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
         : (
          // 로그인이 필요한 페이지에 접근할 때 표시할 팝업
          <Route path="*" element={<Navigate to="/login" />} />
        )
      </Routes>
    </div>
  );
};

export default App;
