import React from 'react';
import Nav from '../../components/Nav';
import './SalonLocatorPage.css';
import '../../App.css';
import Kakaomap from '../../components/Kakaomap';

const SalonLocatorPage = () => {
  return (
    <div className='salonlocator'>
      <Nav />
      <p className='main-title'>주변 미용실 찾기</p>
      <hr />
      <Kakaomap />
    </div>
    
  )
}

export default SalonLocatorPage
