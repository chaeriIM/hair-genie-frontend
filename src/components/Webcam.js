import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import './Webcam.css';
import Loading from './Loading';

function WebcamCapture(props) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFacingFront, setIsFacingFront] = useState(null);
  const [isCameraLoaded, setIsCameraLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      //console.log('모델 로드중...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      //console.log('모델 로드 완료');
    };
    loadModels();
  }, []);

  const handleUserMedia = () => {
    setIsCameraLoaded(true); // 카메라가 로드된 후에 호출
  };

  const checkFaceDirection = async () => {
    if (webcamRef.current) {
      const videoEl = webcamRef.current.video;
      const result = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      // console.log('Face detection result:', result);

      if (result) {
        // 정면인지 확인
        const score = result.detection._score.toFixed(2);
        // console.log(score);
        const isFront = score > 0.85;
        setIsFacingFront(isFront);
      } else {
        setIsFacingFront(false);
      }
    }
  };

  const capture = async () => {
    if (isFacingFront) {
      const imageUrl = webcamRef.current.getScreenshot();
      setCapturedImage(imageUrl);

      const blob = await fetch(imageUrl).then((res) => res.blob());
      props.setValue(blob);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkFaceDirection, 1000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className='container'>
      {!isCameraLoaded ? (
        <Loading message='카메라 로드 중' />
      ) : (
        <>
          {!isFacingFront ? ( 
            <div className="warning-text">
              얼굴이 가려져 있거나 정면이 아닙니다.<br />
              얼굴을 가리지 말고 정면을 향해주세요.
            </div>
          ) : (
            <div className="success-text">
              정면을 바라보고 있습니다!<br />
              이제 촬영 버튼을 눌러주세요.
            </div>
          )
          }
        </>
      )}
      
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
      />

      {isCameraLoaded && (
        <button onClick={capture} className='shoot-btn' disabled={!isFacingFront}>
          촬영
        </button>
      )}
      
      {isCameraLoaded && capturedImage && (
        <div className='container'>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
}

export default WebcamCapture;