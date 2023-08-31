import React, { useState } from 'react';
import Nav from '../../components/Nav';
import './FindIdPwPage.css';
import Modal from 'react-modal';

const FindIdPwPage = () => {

  const [activeTab, setActiveTab] = useState('id');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [nameError, setNameError] = useState('');
  const [idError, setIdError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [idModalOpen, setIdModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    clearErrors();
    clearInputs();
  };

  const clearErrors = () => {
    setNameError('');
    setIdError('');
    setPhoneNumberError('');
  };

  const clearInputs = () => {
    setName('');
    setId('');
    setPhoneNumber('');
  };

  //휴대전화 하이픈 생성
  const formatPhoneNumber = (input) => {
    const numericValue = input.replace(/\D/g, '').slice(0, 11);
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 7) {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    } else {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
    }
  };

  const handlePhoneNumberChange = (value) => {
    const formattedValue = formatPhoneNumber(value);
    setPhoneNumber(formattedValue);
  };

  //다음 버튼 클릭
  const handleNextButtonClick = () => {
    clearErrors();
    
    let hasError = false;

    if (activeTab === 'id') { //아이디 찾기 메뉴
      if (!name) {
        setNameError('이름을 입력해주세요.');
        hasError = true;
      }
      if (!phoneNumber) {
        setPhoneNumberError('전화번호를 입력해주세요.');
        hasError = true;
      } else if (phoneNumber.replace(/\D/g, '').length !== 11) {
        setPhoneNumberError('올바른 전화번호를 입력해주세요.');
        hasError = true;
      }

    } else if (activeTab === 'password') { //비밀번호 찾기 메뉴
      if (!name) {
        setNameError('이름을 입력해주세요.');
        hasError = true;
      }
      if (!id) {
        setIdError('아이디를 입력해주세요.');
        hasError = true;
      }
      if (!phoneNumber) {
        setPhoneNumberError('전화번호를 입력해주세요.');
        hasError = true;
      } else if (phoneNumber.replace(/\D/g, '').length !== 11) {
        setPhoneNumberError('올바른 전화번호를 입력해주세요.');
        hasError = true;
      }
    }

    if (!hasError) {
      if (activeTab === 'id') {
        setIdModalOpen(true);
      } else if (activeTab === 'password') {
        setPasswordModalOpen(true);
      }
    }
  };

  return (
    <div className='find-idpw'>
      <Nav />
      <p className='main-title'>ID/PW 찾기</p>
      <hr />

      <div className='tab-menu'>
        <div>
          <button
            className={activeTab === 'id' ? 'active' : ''}
            onClick={() => handleTabClick('id')}
          >
            아이디 찾기
          </button>
          <button
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => handleTabClick('password')}
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="input-container">
          {activeTab === 'id' && (
            <div className='input-form'>

              <label htmlFor='name'>이름</label>
              <input
                id='이름'
                type='text'
                placeholder='이름을 입력하세요.'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <p className='error-msg'>{nameError}</p>}

              <label htmlFor='phoneNumber'>전화번호</label>
              <input
                id='phoneNumber'
                type='text'
                placeholder='전화번호를 입력하세요.'
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
              />
              {phoneNumberError && <p className='error-msg'>{phoneNumberError}</p>}

            </div>
          )}
          {activeTab === 'password' && (
            <div className='input-form'>

              <label htmlFor='name'>이름</label>
              <input
                id='이름'
                type='text'
                placeholder='이름을 입력하세요.'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <p className='error-msg'>{nameError}</p>}

              <label htmlFor='id'>아이디</label>
              <input
                id='id'
                type='text'
                placeholder='아이디를 입력하세요.'
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              {idError && <p className='error-msg'>{idError}</p>}

              <label htmlFor='phoneNumber'>전화번호</label>
              <input
                id='phoneNumber'
                type='text'
                placeholder='전화번호를 입력하세요.'
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
              />
              {phoneNumberError && <p className='error-msg'>{phoneNumberError}</p>}

            </div>
          )}
        </div>
        
        <button className='next-btn' onClick={handleNextButtonClick}>
          다음
        </button>

      </div>

      {/* ID 모달 */}
      <Modal
        isOpen={idModalOpen}
        onRequestClose={() => setIdModalOpen(false)}
        contentLabel="ID 모달"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h2>아이디</h2>
          <button className="close-button" onClick={() => setIdModalOpen(false)}>
            X
          </button>
        </div>
        <div className="modal-content">
          <p>아이디는 #####입니다.</p>
        </div>
      </Modal>

      {/* 비밀번호 모달 */}
      <Modal
        isOpen={passwordModalOpen}
        onRequestClose={() => setPasswordModalOpen(false)}
        contentLabel="비밀번호 모달"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h2>비밀번호</h2>
          <button className="close-button" onClick={() => setPasswordModalOpen(false)}>
            X
          </button>
        </div>
        <div className="modal-content">
          <p>비밀번호는 ******입니다.</p>
        </div>
      </Modal>

    </div>
  )

}

export default FindIdPwPage