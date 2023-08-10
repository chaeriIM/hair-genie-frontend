import { Route, Routes } from 'react-router-dom';
import './App.css';
<<<<<<< HEAD
/* import MainPage from './pages/MainPage';
import FaceShapePage from './pages/FaceShapePage'; */
import HairSynthesisPage from './pages/HairSynthesisPage';
/* import SalonLocatorPage from './pages/SalonLocatorPage'; */
import SalonReservationPage from './pages/SalonReservationPage';
/* import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage' */
=======
import MainPage from './pages/MainPage';
import FaceShapePage from './pages/FaceShapePage';
import HairSynthesisPage from './pages/HairSynthesisPage';
import SalonLocatorPage from './pages/SalonLocatorPage';
import SalonReservationPage from './pages/SalonReservationPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage'
>>>>>>> 47678822f6e2c029cde019dd785770c3b9bbbb3d


function App() {
  return (
    <div className='app'>
      <Routes>
<<<<<<< HEAD
{/*         <Route path="/" element={<MainPage />} />
 */}        <Route path="hairsynthesis" element={<HairSynthesisPage />} />
{/*         <Route path="faceshape" element={<FaceShapePage />} />
        <Route path="salonlocator" element={<SalonLocatorPage />} /> */}
        <Route path="salonreservation" element={<SalonReservationPage />} />
{/*         <Route path="mypage" element={<MyPage />} />
        <Route path="login" element={<LoginPage />} /> */}
=======
        <Route path="/" element={<MainPage />} />
        <Route path="hairsynthesis" element={<HairSynthesisPage />} />
        <Route path="faceshape" element={<FaceShapePage />} />
        <Route path="salonlocator" element={<SalonLocatorPage />} />
        <Route path="salonreservation" element={<SalonReservationPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="login" element={<LoginPage />} />
>>>>>>> 47678822f6e2c029cde019dd785770c3b9bbbb3d
      </Routes>
    </div>
  );
}

export default App;