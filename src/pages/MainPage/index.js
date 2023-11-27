import React from 'react';
import Nav from '../../components/Nav';
import './MainPage.css'
import Chatbot from '../../components/Chatbot';

const MainPage = () => {
  return (
    <div className='main'>
      <Nav />
      <h1>Hair Genie</h1>
      <Chatbot />
    </div>
  )
}

export default MainPage