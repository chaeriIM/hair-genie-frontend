import React, { useState, useRef, useEffect } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import './MemberInfoEdit.css';
import '../../App.css';
import axios from 'axios';

//비밀번호 변경 내용을 반영하는 내용 추가 필요
const MemberInfoEdit = () => {
    // const userId = "UserId";
    // const Name = "UserName";
    const Nickname = "Nickname";
    const PhoneNumber = "010-1234-5678";
    const Email = "example@example.com";

    const [user, setUser] = useState([]);

    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // eslint-disable-next-line 
    const [file, setFile] = useState(null);
    const [proImage, setProImage] = useState(null);
    const [image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    const [isImageChanged, setIsImageChanged] = useState(false);
    const fileInput = useRef(null);

    const [savePopupOpen, setSavePopupOpen] = useState(false);
    const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);

    const [nicknameValidationStatus, setNicknameValidationStatus] = useState('');
    const [nameValidationStatus, setNameValidationStatus] = useState('');
    const [phoneNumberValidationStatus, setPhoneNumberValidationStatus] = useState('');
    const [emailValidationStatus, setEmailValidationStatus] = useState('');
    const [isNicknameChanged, setIsNicknameChanged] = useState(false);
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [isPhoneNumberChanged, setIsPhoneNumberChanged] = useState(false);
    const [isEmailChanged, setIsEmailChanged] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImage(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);

            setFile(e.target.files[0]);
            setIsImageChanged(true);
        } else {
            setImage(
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            );
            setFile(null);
            setIsImageChanged(false);
        }
    };

    const handleProImageClick = () => {
        fileInput.current.click();
    };

    const handleValueChange = (newValue, defaultValue, changeSetter) => {
        if (newValue !== defaultValue) {
            changeSetter(true);
        } else {
            changeSetter(false);
        }
    };

    const handleSaveClick = () => {
        if (
            isValidNickname(nickname) &&
            isValidName(name) &&
            isValidEmail(email) &&
            isValidPhoneNumber(formatPhoneNumber(phoneNumber))
        ) {
            if (isImageChanged) {
                setProImage(image);
            }
            setSavePopupOpen(true);
        } else {
            setSavePopupOpen(false);
        }
    };

    const handleSaveConfirm = () => {
        setSavePopupOpen(false);
        setSaveCompletePopupOpen(true);

        navigate('/mypage', { updatedImage: proImage });
    };

    const isValidName = (name) => {
        const nameRegex = /^[a-zA-Z가-힣]{2,10}$/;
        return nameRegex.test(name);
    };
    const isValidNickname = (nickname) => {
        const nicknameRegex = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,10}$/;
        return nicknameRegex.test(nickname);
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^010-[0-9]{4}-[0-9]{4}$/;
        return phoneNumberRegex.test(phoneNumber);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const formatPhoneNumber = (phoneNumber) => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        const formattedPhoneNumber = digitsOnly.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
        return formattedPhoneNumber;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const accessToken = localStorage.getItem('accessToken');
    
            const response = await axios.get('http://127.0.0.1:8000/user/get-user-info/', {
              headers: {
                Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰 포함
              },
            });
    
            setUser(response.data);
          } catch (error) {
            console.error('사용자 정보를 가져오는데 실패했습니다.', error);
            //setLoginErrorPopupOpen(true);
    
            setTimeout(() => {
              navigate('/login');
            }, 1500);
          }
        };
        fetchUserInfo();
    
      }, [navigate]);

    return (
        <div>
            <Nav />
            <p className='main-title'>회원 정보 수정</p>
            <hr />
            <div className='body-container'>
                <div className='pro-image' onClick={handleProImageClick}>
                    <div>
                        <img
                            src={image}
                            alt="Profile"
                            style={{ width: '150px', height: '150px' }}
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInput}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <div className='info-container'>
                    <div className='info-row'>
                        <div className="info-input-container">
                            <label htmlFor='uid'>아이디</label>
                            <input
                                id='id'
                                type='text'
                                value={user.uid}
                                readOnly
                                style={{ backgroundColor: "#b4d1ed", hover: "none" }}
                            />
                        </div>
                    </div>

                    <div className={`info-row ${nameValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <label htmlFor='name'>이름</label>
                            <input
                                type='text'
                                placeholder='이름을 입력하세요.'
                                value={name}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setName(inputValue);
                                    handleValueChange(inputValue, name, setIsNameChanged);
                                    setNameValidationStatus(isValidName(inputValue) ? 'success' : 'error');
                                }}
                            />
                        </div>
                        {nameValidationStatus === 'error' && (
                            <p className='error-message'>영문과 한글을 사용하여 2글자 이상 입력하세요.</p>
                        )}
                    </div>

                    <div className={`info-row ${nicknameValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <label htmlFor='nickname'>별명</label>
                            <input
                                id='nickname'
                                type='text'
                                placeholder='별명을 입력하세요.'
                                value={nickname}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setNickname(inputValue);
                                    handleValueChange(inputValue, Nickname, setIsNicknameChanged);
                                    setNicknameValidationStatus(isValidNickname(inputValue) ? 'success' : 'error');
                                }}
                            />
                        </div>
                        {nicknameValidationStatus === 'error' && (
                            <p className='error-message'>영문, 한글, 숫자를 사용하여 2글자 이상 입력하세요.</p>
                        )}
                    </div>

                    <div className={`info-row ${phoneNumberValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <label htmlFor='tel'>전화번호</label>
                            <input
                                id='tel'
                                type='tel'
                                placeholder='전화번호를 입력하세요.'
                                value={phoneNumber}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const formattedPhoneNumber = formatPhoneNumber(inputValue);
                                    setPhoneNumber(formattedPhoneNumber);
                                    handleValueChange(formattedPhoneNumber, PhoneNumber, setIsPhoneNumberChanged);
                                    setPhoneNumberValidationStatus(isValidPhoneNumber(formattedPhoneNumber) ? 'success' : 'error');
                                }}
                            />
                        </div>
                        {phoneNumberValidationStatus === 'error' && (
                            <p className='error-message'>올바른 전화번호를 입력하세요.</p>
                        )}
                    </div>

                    <div className={`info-row ${emailValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <label htmlFor='email'>이메일</label>
                            <input
                                id='email'
                                type='email'
                                placeholder='이메일을 입력하세요.'
                                value={email}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setEmail(inputValue);
                                    handleValueChange(inputValue, Email, setIsEmailChanged);
                                    setEmailValidationStatus(isValidEmail(inputValue) ? 'success' : 'error');
                                }}
                            />
                        </div>
                        {emailValidationStatus === 'error' && (
                            <p className='error-message'>올바른 이메일을 입력하세요.</p>
                        )}
                    </div>

                    <div className='save-button'>
                        <button
                            onClick={handleSaveClick}
                            disabled={
                                !isNameChanged &&
                                !isNicknameChanged &&
                                !isPhoneNumberChanged &&
                                !isEmailChanged &&
                                !isImageChanged
                            }
                        >
                            저장하기
                        </button>
                    </div>
                </div>
                <Popup
                    isOpen={savePopupOpen}
                    message="변경사항을 저장하시겠어요?"
                    onConfirm={handleSaveConfirm}
                    onCancel={() => setSavePopupOpen(false)}
                />
                <Popup
                    isOpen={saveCompletePopupOpen}
                    message="변경사항이 저장되었습니다."
                    isCompleted={true}
                    onCancel={() => setSaveCompletePopupOpen(false)}
                />
            </div>
        </div>
    );
};

export default MemberInfoEdit;