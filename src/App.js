import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import FaceShapePage from './pages/FaceShapePage';
import HairSynthesisPage from './pages/HairSynthesisPage';
import SalonLocatorPage from './pages/SalonLocatorPage';
import SalonReservationPage from './pages/SalonReservationPage/SalonReservationPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage'


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
      </Routes>
    </div>
  );
}

export default App;