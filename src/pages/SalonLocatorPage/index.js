import React from 'react';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import './SalonLocatorPage.css';
import '../../App.css';
import Kakaomap from '../../components/Kakaomap';
// import Map from '../../components/Map';

const SalonLocatorPage = () => {
  return (
    <div className='salonlocator'>
      <Nav />
      <p className='main-title'>주변 미용실 찾기</p>
      <Alert />
      <hr />
      <Kakaomap />
      {/* <Map /> */}
    </div>
    
  )
}

export default SalonLocatorPage
