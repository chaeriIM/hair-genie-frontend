import React from 'react';
import './Loading.css';

const Loading = (props) => {
  return (
    <div className='loading'>
      <img src='/images/spinner.gif' alt='로딩중' className='loading-img'/>
      <p className='loading-msg'>{props.message}</p>
    </div>
  )
}

export default Loading