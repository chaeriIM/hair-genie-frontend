import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import './Chatbot.css';

const Chatbot = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  }

  const buttonImg = chatbotOpen ? '/images/under.png' : '/images/message.png';

  const theme = {
    background: "#f5f8fb",
    fontFamily: "Spoqa Han Sans Neo",
    headerBgColor: "#91bbff",
    headerFontColor: "#fff",
    headerFontSize: "18px",
    botBubbleColor: "#91bbff",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  }

  const steps = [
    ///////////////// 인사 /////////////////
    {
      id: '0',
      message: '안녕하세요. 헤어 지니입니다.',
      trigger: '1',
    },
    {
      id: '1',
      message: '본 챗봇은 상담원과의 실시간 채팅 서비스는 운영하지 않습니다.',
      trigger: '2',
    },
    {
      id: '2',
      message: '도움이 필요하다면 아래 메뉴 중 원하는 항목을 선택해주세요.',
      trigger: '3',
    },
    ///////////////// 메뉴 /////////////////
    {
      id: '3',
      options: [
        { value: 1, label: '헤어스타일 합성', trigger: '4' },
        { value: 2, label: '얼굴형 분석', trigger: '9' },
        { value: 3, label: '주변 미용실 찾기', trigger: '14'},
        { value: 4, label: '미용실 예약', trigger: '18' },
      ],
    },
    ///////////////// 헤어스타일 합성 /////////////////
    {
      id: '4',
      message: '헤어스타일 합성을 선택했습니다.',
      trigger: '5',
    },
    {
      id: '5',
      message: '헤어스타일 합성은 원하는 헤어스타일과 자신의 사진을 업로드하면 훈련된 인공지능 모델이 두 사진을 합성하는 기능입니다.',
      trigger: '6',
    },
    {
      id: '6',
      message: '얼굴 사진 업로드/웹캠으로 사진 찍기 ➔ 원하는 헤어스타일 사진 업로드 ➔ 합성 버튼 클릭을 통해 합성이 가능합니다.',
      trigger: '7',
    },
    {
      id: '7',
      message: '로그인 상태에서는 아래 링크를 클릭하여 이동할 수 있습니다.',
      trigger: '8',
    },
    {
      id: '8',
      component: (
        <div>
          <a href='/hairsynthesis' className='chatbot-link'>합성하기</a>
        </div>
      ),
    },
    ///////////////// 얼굴형 분석 /////////////////
    {
      id: '9',
      message: '얼굴형 분석을 선택했습니다.',
      trigger: '10',
    },
    {
      id: '10',
      message: '얼굴형 분석은 사진을 업로드하면 훈련된 인공지능 모델이 얼굴형 분석 후 최적의 헤어스타일을 추천하는 기능입니다.',
      trigger: '11',
    },
    {
      id: '11',
      message: '얼굴 사진 업로드/웹캠으로 사진 찍기 ➔ 분석 버튼 클릭을 통해 분석이 가능합니다.',
      trigger: '12',
    },
    {
      id: '12',
      message: '로그인 상태에서는 아래 링크를 클릭하여 이동할 수 있습니다.',
      trigger: '13',
    },
    {
      id: '13',
      component: (
        <div>
          <a href='/faceshape' className='chatbot-link'>분석하기</a>
        </div>
      ),
    },
    ///////////////// 주변 미용실 찾기 /////////////////
    {
      id: '14',
      message: '주변 미용실 찾기를 선택했습니다.',
      trigger: '15',
    },
    {
      id: '15',
      message: '주변 미용실 찾기는 사용자 현재 위치를 기준으로 주변에 있는 미용실을 마커와 목록으로 표시하는 기능입니다.',
      trigger: '16',
    },
    {
      id: '16',
      message: '로그인 상태에서는 아래 링크를 클릭하여 이동할 수 있습니다.',
      trigger: '17',
    },
    {
      id: '17',
      component: (
        <div>
          <a href='/salonlocator' className='chatbot-link'>주변 미용실 찾기</a>
        </div>
      ),
    },
    ///////////////// 미용실 예약 /////////////////
    {
      id: '18',
      message: '미용실 예약을 선택했습니다.',
      trigger: '19',
    },
    {
      id: '19',
      message: '미용실 예약과 관련된 카테고리중 문의하고자 하는 내용을 선택해주세요.',
      trigger: '20',
    },
    {
      id: '20',
      options: [
        {
          value: '21',
          label: '미용실 예약 방법',
          trigger: '21',
        },
        {
          value: '24',
          label: '미용실 예약 확인',
          trigger: '24',
        },
      ],
    },
    {
      id: '21',
      message: '미용실 선택 ➔ 날짜/시간 선택 ➔ 시술 메뉴 선택을 통해 예약이 가능합니다.',
      trigger: '22',
    },
    {
      id: '22',
      message: '로그인 상태에서는 아래 링크를 클릭하여 이동할 수 있습니다.',
      trigger: '23',
    },
    {
      id: '23',
      component: (
        <div>
          <a href='/salonreservation' className='chatbot-link'>예약하기</a>
        </div>
      ),
    },
    {
      id: '24',
      message: '미용실 예약 정보는 마이페이지에서 확인할 수 있으며 예약 취소, 리뷰 작성이 가능합니다.',
      trigger: '25',
    },
    {
      id: '25',
      message: '로그인 상태에서는 아래 링크를 클릭하여 이동할 수 있습니다.',
      trigger: '26',
    },
    {
      id: '26',
      component: (
        <div>
          <a href='/reservation-info' className='chatbot-link'>예약 확인</a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <button 
        onClick={toggleChatbot} 
        className='chatbot-btn'
      >
        <img src={buttonImg} alt='챗봇' className='msg-img'/>
      </button>
      <CSSTransition
        in={chatbotOpen}
        timeout={150}
        classNames="chatbot"
        unmountOnExit
      >
        <div>
          <ThemeProvider theme={theme}>
            <ChatBot
              steps={steps}
              headerTitle='Hair Genie ChatBot'
              placeholder={'채팅이 불가능한 채널입니다.'}
              className='chatbot'
            />
          </ThemeProvider>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Chatbot;