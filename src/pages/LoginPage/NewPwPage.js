import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Popup from "../../components/Popup";
import "../../App.css";
import "./NewPwPage.css"

const PasswordChange = () => {
  const { uidb64, token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [saveCompletePopupOpen, setSaveCompletePopupOpen] = useState(false);
  const [saveErrorPopupOpen, setSaveErrorPopupOpen] = useState(false);
  const [expiredLink, setExpiredLink] = useState(false);

  const [passwordValidationStatus, setPasswordValidationStatus] = useState("");
  const [passwordConfirmValidationStatus, setPasswordConfirmValidationStatus] = useState("");

  const navigate = useNavigate();
  const navigateToFindIdPw = () => {
    navigate("../findidpw");
  };

  useEffect(() => {
    const checkLinkValidity = async () => {
      try {
        const apiUrl = "http://127.0.0.1:8000/user/reset/" + uidb64 + "/" + token + "/";
        await axios.get(apiUrl);
      } catch (error) {
        if (error.response.status === 400) {
          console.error('만료된 링크:', error);
          setExpiredLink(true);
        }
      }
    };

    checkLinkValidity();
  }, [uidb64, token]);

  const handleSaveClick = async () => {
    if (!isValidPassword(password)) {
      setPasswordValidationStatus("error");
      return;
    }
    setPasswordValidationStatus("success");

    if (password !== passwordConfirm) {
      setPasswordConfirmValidationStatus("error");
      return;
    }
    setPasswordConfirmValidationStatus("success");

    try {
      const apiUrl = "http://127.0.0.1:8000/user/reset/" + uidb64 + "/" + token + "/"
      const response = await axios.post(apiUrl, {
        uidb64: uidb64,
        token: token,
        new_password: password,
      });
  
      console.log(response.data);
      setSaveCompletePopupOpen(true);
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
  
    } catch (error) {

      console.error('비밀번호 업데이트 중 오류 발생:', error);
      setSaveErrorPopupOpen(true);
    }
  };

  const areAllFieldsFilled = password && passwordConfirm;

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()._-]).{8,20}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="new-pw">
      {expiredLink ? (
        <div className="body-container">
          <div className="newpw-container">
            <h2>비밀번호 재설정 오류</h2>
            <p className="fail">비밀번호 재설정 링크가 이미 사용되어 올바르지 않습니다.<br/>
                비밀번호 찾기를 다시 시도 해주세요.
            </p>
            <button className="navigate-btn" onClick={navigateToFindIdPw}>id/pw 찾기</button>
          </div>
        </div>
      ) : (
        <div className="body-container">
          <div className="newpw-container">
            <p className="newpw-title">비밀번호 재설정</p>
            <p className="newpw-notice">새로운 비밀번호를 입력해주세요.</p>
            <div className="info-container">
              
              <div
                className={`info-row ${
                  passwordValidationStatus === "error" ? "has-error" : ""
                }`}
              >
                <div className="info-input-container"></div>
              </div>
              <div
                className={`info-row ${
                  passwordValidationStatus === "error" ? "has-error" : ""
                }`}
              >
                <div className="info-input-container">
                  <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={password}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setPassword(inputValue);

                      setPasswordValidationStatus(
                        isValidPassword(inputValue) ? "success" : "error"
                      );
                    }}
                  />
                </div>
                {passwordValidationStatus === "error" && (
                  <p className="error-message">
                    영문/숫자/특수문자를 모두 사용하여 8글자 이상 입력하세요.
                  </p>
                )}
              </div>
              <div
                className={`info-row ${
                  passwordConfirmValidationStatus === "error" ? "has-error" : ""
                }`}
              >
                <div className="info-input-container">
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setPasswordConfirm(inputValue);
                      setPasswordConfirmValidationStatus(
                        inputValue === password ? "success" : "error"
                      );
                    }}
                  />
                </div>
                {passwordConfirmValidationStatus === "error" && (
                  <p className="error-message">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
              <div className="save-button">
                <button onClick={handleSaveClick} disabled={!areAllFieldsFilled}>
                  비밀번호 재설정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Popup
        isOpen={saveCompletePopupOpen}
        message="비밀번호가 재설정되었습니다."
        isCompleted={true}
        onCancel={() => setSaveCompletePopupOpen(false)}
      />
      <Popup
        isOpen={saveErrorPopupOpen}
        message="오류가 발생했습니다. 다시 시도해 주세요."
        isCompleted={true}
        onCancel={() => setSaveErrorPopupOpen(false)}
      />
    </div>
  );
};

export default PasswordChange;
