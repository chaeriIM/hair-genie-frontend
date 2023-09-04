import React from 'react';
import Nav from '../../components/Nav';
import { useLocation } from 'react-router-dom';
import '../../App.css';

const MyFaceType = () => {
  const location = useLocation();
  const selectedType = location.state?.selectedType || "";

  let dataToShow;
  if (selectedType === "Heart") { // 하트형
    dataToShow = (
      <div className='container'>
        <div className='MFT-description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br />
            - 귀 높이에서부터 웨이브가 들어간 스타일<br />
            - 짧은 단발머리에 C컬펌<br />
            - 앞머리를 내리거나 턱선 근처 무거운 느낌의 굵은 S컬펌<br />
            - 머리를 길게 길러 굵은 웨이브의 볼륨감<br />
            - 한쪽으로 넘긴 스타일<br />
            - 똥머리, 포니테일<br />
            - 턱선에서 어깨 길이에 뱅 스타일<br />
            - 넓은 이마는 시스루 뱅 스타일 앞머리로 커버<br />
            - 6:4, 7:3 가르마<br />
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br />
            - 앞머리를 일자로 자르거나 스트레이트 헤어를 하면 하관이 더 뾰족해보임<br />
            - 짧은 숏컷이나 얼굴 전체를 드러내는 스타일<br />
            - 뿌리볼륨<br />
          </div>
        </div>
        <button
          className='image-btn'
          onClick={() => window.open('https://www.pinterest.co.kr/search/pins/?q=%ED%95%98%ED%8A%B8%ED%98%95%20%ED%97%A4%EC%96%B4%EC%8A%A4%ED%83%80%EC%9D%BC&rs=typed', '_blank')}>
          어울리는 헤어스타일 사진 보러가기
        </button>
      </div>
    );
  } else if (selectedType === "Oval") { // 계란형
    dataToShow = (
      <div className='container'>
        <div className='MFT-description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br />
            - 다 좋지만 갸름한 얼굴형을 잘 보여줄 수 있는<br />
            업 스타일, 포니테일, 컬이 들어간 레이어드 S컬펌<br />
            - 중간 길이의 머리에 가벼운 웨이브, 보브컷<br />
            - 짧은 커트에 베이비펌, 셋팅펌<br />
            - 가르마 6:4, 8:2<br />
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br />
            - 이마를 가리는 무거운 느낌의 뱅<br />
            - 너무 긴 머리<br />
          </div>
        </div>
        <button
          className='image-btn'
          onClick={() => window.open('https://www.pinterest.co.kr/search/pins/?q=%EA%B3%84%EB%9E%80%ED%98%95%20%ED%97%A4%EC%96%B4%EC%8A%A4%ED%83%80%EC%9D%BC&rs=typed', '_blank')}>
          어울리는 헤어스타일 사진 보러가기
        </button>
      </div>
    );
  } else if (selectedType === "Round") { // 둥근형
    dataToShow = (
      <div className='container'>
        <div className='MFT-description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br />
            - 앞머리를 내는 것보다는 이마를 들어내 길어 보이게 하는 스타일<br />
            - 윗머리에 볼륨감<br />
            - 턱선까지 오는 단발, 가슴 중간을 넘는 긴 기장<br />
            - 레이어드 C컬 펌<br />
            - 턱선이나 목선에 맞춘 레이어드 컷<br />
            - 앞머리가 없는 긴 웨이브, 이마를 들어낸 긴 생머리<br />
            - 높게 묶은 하이 포니테일<br />
            - 옆으로 넘길 수 있는 긴 앞머리 스타일<br />
            - 한쪽 머리를 귀 뒤로 넘겨주기<br />
            - 6:4 가르마<br />
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br />
            - 5:5 가르마 피하기<br />
            (하고싶다면 지그재그 가르마)<br />
          </div>
        </div>
        <button
          className='image-btn'
          onClick={() => window.open('https://www.pinterest.co.kr/search/pins/?q=%EB%91%A5%EA%B7%BC%ED%98%95%20%ED%97%A4%EC%96%B4%EC%8A%A4%ED%83%80%EC%9D%BC&rs=typed', '_blank')}>
          어울리는 헤어스타일 사진 보러가기
        </button>
      </div>
    );
  } else if (selectedType === "Square") { // 각진형
    dataToShow = (
      <div className='container'>
        <div className='MFT-description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br />
            - 턱 쪽 부근의 옆머리에 가볍게 S자 웨이브<br />
            - 머리 위쪽에 볼륨을 넣어 부드러운 곡선의 형태의 헤어<br />
            - 안쪽으로 말려들어가는 스타일<br />
            - S컬 웨이브 펌<br />
            - 굵은 웨이브가 들어간 롱 헤어 스타일<br />
            - 옆머리를 자연스럽게 빼서 흘러내리듯이 연출하는 업스타일<br />
            - 미디엄 길이에 층을 내어 레이어드 C컬 펌<br />
            - 턱 아래를 향해 사선으로 내려오는 보브 헤어 스타일<br />
            - 6:4 가르마<br />
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br />
            - 앞머리를 짧게 내는 것은 얼굴 각 부각<br />
            - 5:5 정가르마, 반듯한 일자 앞머리<br />
          </div>
        </div>
        <button
          className='image-btn'
          onClick={() => window.open('https://www.pinterest.co.kr/search/pins/?q=%EA%B0%81%EC%A7%84%ED%98%95%20%ED%97%A4%EC%96%B4%EC%8A%A4%ED%83%80%EC%9D%BC&rs=typed', '_blank')}>
          어울리는 헤어스타일 사진 보러가기
        </button>
      </div>
    );
  } else if (selectedType === "Oblong") { // 긴얼굴형
    dataToShow = (
      <div className='container'>
        <div className='MFT-description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br />
            - 앞머리를 내어 얼굴 길이 보완<br />
            - 옆머리에 S자로 자연스러운 웨이브로 볼륨감 주는 스타일<br />
            - 미디엄~롱기장의 루즈한 S컬 펌<br />
            - 뱅 스타일, 턱선 길이에서 아래쪽에 풍성한 컬<br />
            - 옆머리를 층을 내어 커트, 눈썹에 닿는 길이의 가벼운 느낌의 시스루뱅<br />
            - 숏컷<br />
            - 5:5 가르마 대신 사이드로 머리 몰아주기<br />
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br />
            - 처피뱅 앞머리<br />
            - 앞머리가 없는 스트레이트 헤어<br />
            - 턱선에 닿는 길이의 단발<br />
          </div>
        </div>
        <button
          className='image-btn'
          onClick={() => window.open('https://www.pinterest.co.kr/search/pins/?q=%EA%B8%B4%20%EC%96%BC%EA%B5%B4%ED%98%95%20%ED%97%A4%EC%96%B4%EC%8A%A4%ED%83%80%EC%9D%BC&rs=typed', '_blank')}>
          어울리는 헤어스타일 사진 보러가기
        </button>
      </div>
    );
  }

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>{selectedType} </p>
      <hr />
      <div className='body-container'>
          <div>{dataToShow}</div>
      </div>
    </div>
  )
}

export default MyFaceType;