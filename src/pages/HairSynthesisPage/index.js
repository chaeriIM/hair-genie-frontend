import React from 'react'
import Nav from '../../components/Nav'
import './HairSynthesisPage.css'

const HairSynthesisPage = () => {
  return (
    <div className='hairsynthesis'>
      <Nav />
      <p>Genie Time</p>
      <hr className='separator' /> {/* 구분선을 추가하고 CSS 클래스를 지정 */}
    </div>
  )
}

export default HairSynthesisPage