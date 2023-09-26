import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav";
import Popup from "../../components/Popup";
import { useNavigate } from "react-router-dom";
import "./MemberInfoEdit.css";
import "../../App.css";
import axios from "axios";

const MemberInfoEdit = () => {
  const [user, setUser] = useState([]);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [savePopupOpen, setSavePopupOpen] = useState(false);
  const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);

  const [nicknameValidationStatus, setNicknameValidationStatus] = useState("");
  const [nameValidationStatus, setNameValidationStatus] = useState("");
  const [phoneNumberValidationStatus, setPhoneNumberValidationStatus] = useState("");
  const [emailValidationStatus, setEmailValidationStatus] = useState("");

  const navigate = useNavigate();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("http://127.0.0.1:8000/user/info/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰 포함
          },
        });

        setUser(response.data);
        setName(response.data.uname);
        setNickname(response.data.unickname);
        setPhoneNumber(response.data.uphone);
        setEmail(response.data.uemail);

      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다.", error);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // 사용자 정보 업데이트
  const updateUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const updatedUserData = {
        uname: name,
        unickname: nickname,
        uphone: phoneNumber,
        uemail: email,
      };

      const response = await axios.put("http://127.0.0.1:8000/user/info/",
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log("사용자 정보가 성공적으로 업데이트되었습니다:", response.data);

    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
    }
  };

  // 프로필 사진 업데이트
  const updateUserImage = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("profile_image", profileImage);

      const response = await axios.put("http://127.0.0.1:8000/user/info/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("사용자 사진이 성공적으로 업데이트되었습니다:", response.data);
      
    } catch (error) {
      console.error("사용자 사진 업데이트 실패:", error);
    }
  }

  // 저장 버튼 클릭
  const handleSaveClick = () => {
    if (
      isValidNickname(nickname) &&
      isValidName(name) &&
      isValidEmail(email) &&
      isValidPhoneNumber(formatPhoneNumber(phoneNumber))
    ) {
      setSavePopupOpen(true);
    } else {
      setSavePopupOpen(false);
    }
  };

  // 팝업창에서 확인 버튼 클릭
  const handleSaveConfirm = () => {
    setSavePopupOpen(false);
    setSaveCompletePopupOpen(true);
    updateUserInfo();
    updateUserImage();

    setTimeout(() => {
      navigate('/mypage');
    }, 1300);
  };

  // 프로필 이미지 클릭 시 input 클릭
  const handleProfileImageClick = () => {
    document.getElementById("profileImageInput").click();
  };

  // 프로필 이미지를 업로드
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setProfileImage(selectedFile);

    // 이미지 파일 미리보기
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("profileImagePreview").src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  // 유효성 검사
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
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    const formattedPhoneNumber = digitsOnly.replace(
      /^(\d{3})(\d{3,4})(\d{4})$/,
      "$1-$2-$3"
    );
    return formattedPhoneNumber;
  };

  return (
    <div>
      <Nav />
      <p className="main-title">회원 정보 수정</p>
      <hr />
      <div className="body-container">

        <div className='pro-image'>
          <img
            src={`http://127.0.0.1:8000${user.profile_image}`}
            alt="ProfileImage"
            id="profileImagePreview"
            onClick={handleProfileImageClick}
          />
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="info-container">
          <div className="info-row">
            <div className="info-input-container">
              <label htmlFor="id">아이디</label>
              <input
                id="id"
                type="text"
                value={user.uid || ''}
                readOnly
                style={{ backgroundColor: "#b4d1ed", hover: "none" }}
              />
            </div>
          </div>

          <div
            className={`info-row ${
              nameValidationStatus === "error" ? "has-error" : ""
            }`}
          >
            <div className="info-input-container">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                placeholder="이름을 입력하세요."
                value={name || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setName(inputValue);
                  setNameValidationStatus(
                    isValidName(inputValue) ? "success" : "error"
                  );
                }}
              />
            </div>
            {nameValidationStatus === "error" && (
              <p className="error-message">
                영문과 한글을 사용하여 2글자 이상 입력하세요.
              </p>
            )}
          </div>

          <div
            className={`info-row ${
              nicknameValidationStatus === "error" ? "has-error" : ""
            }`}
          >
            <div className="info-input-container">
              <label htmlFor="nickname">별명</label>
              <input
                id="nickname"
                type="text"
                placeholder="별명을 입력하세요."
                value={nickname || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setNickname(inputValue);
                  setNicknameValidationStatus(
                    isValidNickname(inputValue) ? "success" : "error"
                  );
                }}
              />
            </div>
            {nicknameValidationStatus === "error" && (
              <p className="error-message">
                영문, 한글, 숫자를 사용하여 2글자 이상 입력하세요.
              </p>
            )}
          </div>

          <div
            className={`info-row ${
              phoneNumberValidationStatus === "error" ? "has-error" : ""
            }`}
          >
            <div className="info-input-container">
              <label htmlFor="tel">전화번호</label>
              <input
                id="tel"
                type="tel"
                placeholder="전화번호를 입력하세요."
                value={phoneNumber || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const formattedPhoneNumber = formatPhoneNumber(inputValue);
                  setPhoneNumber(formattedPhoneNumber);
                  setPhoneNumberValidationStatus(
                    isValidPhoneNumber(formattedPhoneNumber)
                      ? "success"
                      : "error"
                  );
                }}
              />
            </div>
            {phoneNumberValidationStatus === "error" && (
              <p className="error-message">올바른 전화번호를 입력하세요.</p>
            )}
          </div>

          <div
            className={`info-row ${
              emailValidationStatus === "error" ? "has-error" : ""
            }`}
          >
            <div className="info-input-container">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요."
                value={email || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setEmail(inputValue);
                  setEmailValidationStatus(
                    isValidEmail(inputValue) ? "success" : "error"
                  );
                }}
              />
            </div>
            {emailValidationStatus === "error" && (
              <p className="error-message">올바른 이메일을 입력하세요.</p>
            )}
          </div>

          <div className="save-button">
            <button onClick={handleSaveClick}>저장하기</button>
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
