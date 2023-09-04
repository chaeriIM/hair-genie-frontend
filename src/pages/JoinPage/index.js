import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinPage.css';
import '../../App.css';
import Popup from '../../components/Popup';

const JoinPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [joinPopupOpen, setJoinPopupOpen] = useState(false);
  const [joinCompletePopupOpen, setJoinCompletePopupOpen] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  /*   const [setJoinPopupMessage] = useState('');*/

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

  const handleJoinClick = () => {
    if (!areAllFieldsFilled) {
      setJoinPopupOpen(true);
      return;
    }

    if (!isValidId(userId)) {
      setIdValidationStatus('error');
      return;
    }
    setIdValidationStatus('success');

    if (!isValidPassword(password)) {
      setPasswordValidationStatus('error');
      return;
    }
    setPasswordValidationStatus('success');

    if (password !== passwordConfirm) {
      setPasswordConfirmValidationStatus('error');
      return;
    }
    setPasswordConfirmValidationStatus('success');

    if (!isValidName(name)) {
      setNameValidationStatus('error');
      return;
    }
    setNameValidationStatus('success');

    if (!isValidNickname(nickname)) {
      setNicknameValidationStatus('error');
      return;
    }
    setNicknameValidationStatus('success');

    if (!isValidEmail(email)) {
      setEmailValidationStatus('error');
      return;
    }
    setEmailValidationStatus('success');

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!isValidPhoneNumber(formattedPhoneNumber)) {
      setPhoneNumberValidationStatus('error');
      return;
    } else {
      setPhoneNumberValidationStatus('success');
    }

    setJoinPopupOpen(true);
  };

  /*   // 아이디 중복 체크
    checkIdAvailability(userId)
      .then((response) => {
        if (!response.available) {
          setJoinPopupMessage('이미 사용 중인 아이디입니다.');
          setJoinPopupOpen(true);
        } else {
          setJoinPopupOpen(true);
        }
      })
      .catch((error) => {
        console.error('ID 중복체크 실패', error);
      });
  }; */

  const handleJoinPopupConfirm = () => {
    setJoinPopupOpen(false);
    setJoinCompletePopupOpen(true);

    setTimeout(() => {
      navigate('/');
    }, 1000);
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

  /*  // 아이디 중복 체크 API 호출 (가정)
   const checkIdAvailability = async (id) => {
     try {
       const response = await fetch(`/api/checkIdAvailability?id=${id}`);
       const data = await response.json();
       return data;
     } catch (error) {
       console.error('ID 중복 체크 실패', error);
       throw error;
     }
   }; */

  // 전화번호에 자동으로 하이픈 추가
  const formatPhoneNumber = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const formattedPhoneNumber = digitsOnly.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
    return formattedPhoneNumber;
  };

  return (
    <div className='join'>
      <div className='body-container'>
        <p className='join-title' onClick={() => (window.location.href = "/")} >회원 가입</p>
        <div className='info-container'>
          <div className={`info-row ${idValidationStatus === 'error' ? 'has-error' : ''}`}>
            <div className="info-input-container">
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
            </div>
            {idValidationStatus === 'error' && (
              <p className='error-message'> 영문과 숫자를 사용하여 6글자 이상 입력하세요.</p>
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
            <button onClick={handleJoinClick} disabled={!areAllFieldsFilled || !consentAgreed}>가입하기</button>
          </div>
        </div>
      </div>
      <Popup
        isOpen={joinPopupOpen}
        message="회원가입 하시겠어요?"
        onConfirm={handleJoinPopupConfirm}
        onCancel={() => setJoinPopupOpen(false)}
      />
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