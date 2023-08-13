import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import FaceShapePage from './pages/FaceShapePage';
import HairSynthesisPage from './pages/HairSynthesisPage';
import SalonLocatorPage from './pages/SalonLocatorPage';
import SalonReservationPage from './pages/SalonReservationPage/SalonReservationPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage'
import FaceResultPage from './pages/FaceShapePage/FaceResultPage';
import HairResultPage from './pages/HairSynthesisPage/HairResultPage';


function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="hairsynthesis" element={<HairSynthesisPage />} />
        <Route path="faceshape" element={<FaceShapePage />} />
        <Route path="salonlocator" element={<SalonLocatorPage />} />
        <Route path="salonreservation" element={<SalonReservationPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="faceresult" element={<FaceResultPage />} />
        <Route path="hairresult" element={<HairResultPage />} />
      </Routes>
    </div>
  );
}

export default App;