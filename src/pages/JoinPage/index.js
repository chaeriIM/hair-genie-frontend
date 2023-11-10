import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinPage.css';
import '../../App.css';
import Popup from '../../components/Popup';
import axios from 'axios';

const JoinPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [joinCompletePopupOpen, setJoinCompletePopupOpen] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [idValidationStatus, setIdValidationStatus] = useState('');
  const [passwordValidationStatus, setPasswordValidationStatus] = useState('');
  const [passwordConfirmValidationStatus, setPasswordConfirmValidationStatus] = useState('');
  const [nameValidationStatus, setNameValidationStatus] = useState('');
  const [nicknameValidationStatus, setNicknameValidationStatus] = useState('');
  const [emailValidationStatus, setEmailValidationStatus] = useState('');
  const [phoneNumberValidationStatus, setPhoneNumberValidationStatus] = useState('');

  const navigate = useNavigate();

  const handleConsentToggle = () => {
    setConsentAgreed(!consentAgreed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!areAllFieldsFilled || !consentAgreed) {
      // 필수 입력 필드가 비어있거나 동의가 되지 않으면 처리 중단
      return;
    }

    // 아이디 중복 확인
    if (idValidationStatus !== 'no-exist') {
      // 'no-exist' 상태가 아니면 중복 확인을 하지 않은 것으로 간주
      setIdValidationStatus('no-check');
      return;
    }
  
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  
    const userData = {
      uid: userId,
      password,
      uname: name,
      unickname: nickname,
      uphone: formattedPhoneNumber,
      email: email,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/join/', userData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    setJoinCompletePopupOpen(true);

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const handleCheckIdDuplicate = async () => {
    if (!isValidId(userId)) {
      // 아이디가 유효하지 않을 때 처리
      setIdValidationStatus('error');
      return;
    }
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/user/check-id-exists/', {
        params: { uid: userId },
      });
      const data = response.data;
  
      if (data.exists) { //아이디 존재(true)
        setIdValidationStatus('exist');
      } else { //존재x(false)
        setIdValidationStatus('no-exist');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const areAllFieldsFilled =
    userId && password && passwordConfirm && name && nickname && phoneNumber && email;

  const isValidId = (id) => {
    const idRegex = /^[a-zA-Z0-9]{6,12}$/;
    return idRegex.test(id);
  };
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()._-]).{8,20}$/;
    return passwordRegex.test(password);
  };
  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z가-힣]{2,10}$/;
    return nameRegex.test(name);
  };
  const isValidNickname = (nickname) => {
    const nicknameRegex = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,10}$/;
    return nicknameRegex.test(nickname);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^010-[0-9]{4}-[0-9]{4}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  // 전화번호에 자동으로 하이픈 추가
  const formatPhoneNumber = (phoneNumber) => {
    const numericValue = phoneNumber.replace(/\D/g, '').slice(0, 11);
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 7) {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    } else {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
    }
  };

  return (
    <div className='join'>
      <div className='body-container'>
        <div className='join-container'>
          <p className='join-title' onClick={() => (window.location.href = "/")} >회원 가입</p>
          <div className={`info-row ${idValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <div className='id-wrapper'>
                <input
                  type='text'
                  placeholder='아이디'
                  value={userId}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 12) {
                      setUserId(inputValue);
                      setIdValidationStatus(isValidId(inputValue) ? 'success' : 'error');
                    } else if (inputValue.length <= 12) {
                      setUserId(userId);
                    }
                  }}
                />
                <button onClick={handleCheckIdDuplicate}>중복 확인</button>
              </div>
            </div>
            {idValidationStatus === 'error' && (
              <p className='error-message'> 영문과 숫자를 사용하여 6글자 이상 입력하세요.</p>
            )}
            {idValidationStatus === 'exist' && (
              <p className='error-message'> 이미 존재하는 아이디입니다.</p>
            )}
            {idValidationStatus === 'no-exist' && (
              <p className='success-message'> 사용 가능한 아이디입니다.</p>
            )}
            {idValidationStatus === 'no-check' && (
              <p className='error-message'> 아이디 중복 확인을 해주세요.</p>
            )}
          </div>
          <div className={`info-row ${passwordValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='password'
                placeholder='비밀번호'
                value={password}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 20) {
                    setPassword(inputValue);
                    setPasswordValidationStatus(isValidPassword(inputValue) ? 'success' : 'error');
                  } else if (inputValue.length <= 20) {
                    setPassword(password);
                  }
                }}
              />
            </div>
            {passwordValidationStatus === 'error' && (
              <p className='error-message'>영문/숫자/특수문자를 모두 사용하여 8글자 이상 입력하세요.</p>
            )}
          </div>
          <div className={`info-row ${passwordConfirmValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='password'
                placeholder='비밀번호 확인'
                value={passwordConfirm}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 20) {
                    setPasswordConfirm(inputValue);
                    if (inputValue === password) {
                      setPasswordConfirmValidationStatus('success');
                    } else {
                      setPasswordConfirmValidationStatus('error');
                    }
                  } else {
                    setPasswordConfirm(passwordConfirm);
                  }
                }}
              />
            </div>
            {passwordConfirmValidationStatus === 'error' && (
              <p className='error-message'>비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <div className={`info-row ${nameValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='text'
                placeholder='이름'
                value={name}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 10) {
                    setName(inputValue);
                    setNameValidationStatus(isValidName(inputValue) ? 'success' : 'error');
                  } else if (inputValue.length <= 10) {
                    setName(name);
                  }
                }}
              />
            </div>
            {nameValidationStatus === 'error' && (
              <p className='error-message'>영문과 한글을 사용하여 2글자 이상 입력하세요.</p>
            )}
          </div>
          <div className={`info-row ${nicknameValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='text'
                placeholder='별명'
                value={nickname}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 10) {
                    setNickname(inputValue);
                    setNicknameValidationStatus(isValidNickname(inputValue) ? 'success' : 'error');
                  } else if (inputValue.length <= 10) {
                    setNickname(nickname);
                  }
                }}
              />
            </div>
            {nicknameValidationStatus === 'error' && (
              <p className='error-message'>영문, 한글, 숫자를 사용하여 2글자 이상 입력하세요.</p>
            )}
          </div>
          <div className={`info-row ${phoneNumberValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='tel'
                placeholder='전화번호'
                value={phoneNumber}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const formattedPhoneNumber = formatPhoneNumber(inputValue);
                  if (formattedPhoneNumber.length <= 13) {
                    setPhoneNumber(formattedPhoneNumber);
                    setPhoneNumberValidationStatus(isValidPhoneNumber(formattedPhoneNumber) ? 'success' : 'error');
                  }
                }}
              />
            </div>
            {phoneNumberValidationStatus === 'error' && (
              <p className='error-message'>올바른 전화번호를 입력하세요.</p>
            )}
          </div>
          <div className={`info-row ${emailValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
              <input
                type='email'
                placeholder='이메일'
                value={email}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setEmail(inputValue);
                  setEmailValidationStatus(isValidEmail(inputValue) ? 'success' : 'error');
                }}
              />
            </div>
            {emailValidationStatus === 'error' && (
              <p className='error-message'>올바른 이메일을 입력하세요.</p>
            )}
          </div>
          <div className='Personal-information-agreement'>
            <div className='Personal-information-checkbox'>
              <input
                type='checkbox'
                checked={consentAgreed}
                onChange={handleConsentToggle}
              />
            </div>
            <p className='checkbox-agreement-message'>개인 정보 제공에 동의합니다.</p>
          </div>
          <div className='join-button'>
            <button onClick={handleSubmit} disabled={!areAllFieldsFilled || !consentAgreed}>가입하기</button>
          </div>
        </div>
      </div>
      
      <Popup
        isOpen={joinCompletePopupOpen}
        message="회원가입이 완료되었습니다."
        isCompleted={true}
        onCancel={() => setJoinCompletePopupOpen(false)}
      />

    </div>
  );
};

export default JoinPage;