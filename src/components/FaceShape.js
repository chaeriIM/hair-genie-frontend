import React, { useEffect, useState } from 'react'

const FaceShape = () => {

  const [result, setResult] = useState("");
  // 하트형(Heart), 계란형(Oval), 둥근형(Round), 각진형(Square), 긴 얼굴형(Oblong)
  
  //임시로 랜덤으로 값을 가져오도록 설정
  const randomResult = () => {
    const faceShapes = ["heart", "oval", "round", "square", "oblong"];
    const randomIndex = Math.floor(Math.random() * faceShapes.length);
    const randomFaceShape = faceShapes[randomIndex];
    setResult(randomFaceShape);
  };

  useEffect(() => {
    randomResult();
  }, []);

  let dataToShow;
  if (result === "heart") {
    dataToShow = (
      <div className='container'>
        <div className='result-image'>
          결과물
        </div>
        <p>하트형</p>
        <p>하트형(Heart)은 ~~~ 이런 헤어 스타일이 어울립니다.</p>
      </div>
    );
  } else if (result === "oval") {
    dataToShow = (
      <div className='container'>
        <div className='result-image'>
          결과물
        </div>
        <p>계란형</p>
        <p>계란형(Oval)은 ~~~ 이런 헤어 스타일이 어울립니다.</p>
      </div>
    );
  } else if (result === "round") {
    dataToShow = (
      <div className='container'>
        <div className='result-image'>
          결과물
        </div>
        <p>둥근형</p>
        <p>둥근형(Round)은 ~~~ 이런 헤어 스타일이 어울립니다.</p>
      </div>
    );
  } else if (result === "square") {
    dataToShow = (
      <div className='container'>
        <div className='result-image'>
          결과물
        </div>
        <p>각진형</p>
        <p>각진형(Square)은 ~~~ 이런 헤어 스타일이 어울립니다.</p>
      </div>
    );
  } else if (result === "oblong") {
    dataToShow = (
      <div className='container'>
        <div className='result-image'>
          결과물
        </div>
        <p>긴 얼굴형</p>
        <p>긴 얼굴형(Oblong)은 ~~~ 이런 헤어 스타일이 어울립니다.</p>
      </div>
    );
  }

  return (
    <div>{dataToShow}</div>
  )
}

export default FaceShape