import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className='loading'>
      {/* <img src='/images/spinner.gif' alt='로딩중' className='loading-img'/> */}
      <p className='loading-msg'>얼굴형 분석 중</p>
    </div>
  )
}

export default Loading