import React, { useState } from 'react';
import Nav from '../../components/Nav';
import Popup from '../../components/Popup';
import { useNavigate } from 'react-router-dom';
import './MemberInfoEdit.css';
import '../../App.css';

//비밀번호 변경 내용을 반영하는 내용 추가 필요
const MemberInfoEdit = () => {
    const userId = "UserId";
    const name = "UserName";
    const Nickname = "Nickname";
    const PhoneNumber = "010-1234-5678";
    const Email = "example@example.com";

    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState(Nickname);
    const [phoneNumber, setPhoneNumber] = useState(PhoneNumber);
    const [email, setEmail] = useState(Email);

    const [savePopupOpen, setSavePopupOpen] = useState(false);
    const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);

    const [nicknameValidationStatus, setNicknameValidationStatus] = useState('');
    const [phoneNumberValidationStatus, setPhoneNumberValidationStatus] = useState('');
    const [emailValidationStatus, setEmailValidationStatus] = useState('');
    const [isNicknameChanged, setIsNicknameChanged] = useState(false);
    const [isPhoneNumberChanged, setIsPhoneNumberChanged] = useState(false);
    const [isEmailChanged, setIsEmailChanged] = useState(false);

    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const imageUrl = event.target.result;
                setProfileImage(imageUrl);
            };

            reader.readAsDataURL(selectedImage);
        }
    };

    const handleProfileImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleValueChange = (newValue, defaultValue, changeSetter) => {
        if (newValue !== defaultValue) {
            changeSetter(true);
        } else {
            changeSetter(false);
        }
    };

    const handleSaveClick = () => {
        if (!areAllFieldsFilled) {
            setSavePopupOpen(true);
            return;
        }

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

        setSavePopupOpen(true);
    };

    const handleSaveConfirm = () => {
        setSavePopupOpen(false);
        setSaveCompletePopupOpen(true);

        setTimeout(() => {
            navigate('/mypage');
        }, 800);
    };

    const areAllFieldsFilled =
        nickname && phoneNumber && email;

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

    return (
        <div>
            <Nav />
            <p className='main-title'>회원 정보 수정</p>
            <hr />
            <div className='body-container'>
                <div className='profile-image' onClick={handleProfileImageClick}>
                    <div className='profile-image-container'>
                        {profileImage && (
                            <img src={profileImage} alt='프로필 이미지' />
                        )}
                        {!profileImage && (
                            <div className='empty-profile'>
                                프로필 이미지를 등록하세요.
                            </div>
                        )}
                    </div>
                </div>
                <input
                    type='file'
                    accept='image/*'
                    id='imageInput'
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <div className='info-container'>
                    <div className='info-row'>
                        <div className="info-input-container">
                            <input
                                type='text'
                                value={userId}
                                readOnly
                                style={{ backgroundColor: "#b4d1ed" }}
                            />
                        </div>
                    </div>
                    <div className='info-row'>
                        <div className="info-input-container">
                            <input
                                type='text'
                                value={name}
                                readOnly
                                style={{ backgroundColor: "#b4d1ed" }}
                            />
                        </div>
                    </div>
                    <div className={`info-row ${nicknameValidationStatus === 'error' ? 'has-error' : ''}`}>
                        <div className="info-input-container">
                            <input
                                type='text'
                                placeholder='별명'
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
                            <input
                                type='tel'
                                placeholder='전화번호'
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
                            <input
                                type='email'
                                placeholder='이메일'
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
                        <button onClick={handleSaveClick} disabled={!isNicknameChanged && !isPhoneNumberChanged && !isEmailChanged}>저장하기</button>
                    </div>
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
    );
};

export default MemberInfoEdit;