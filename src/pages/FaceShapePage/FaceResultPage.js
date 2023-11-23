import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import Chatbot from '../../components/Chatbot';

const FaceResultPage = () => {

  const [faceImage, setFaceImage] = useState('');
  const [result, setResult] = useState('');
  const [predictions, setPredictions] = useState([]);

  const navigate = useNavigate();

  const navigateToPrevious = () => {
    navigate("/faceshape")
    localStorage.removeItem('cropped_face_url');
    localStorage.removeItem('predictions');
  }

  useEffect(() => {
    const uploadedImage = localStorage.getItem('cropped_face_url');
    const savePredictions = JSON.parse(localStorage.getItem('predictions'));
    setFaceImage(uploadedImage);
    setResult(savePredictions[0].type);

    setPredictions(savePredictions);
  }, []);
  
  const getFaceShapeName = () => {
    switch (result) {
      case 'Heart':
        return '하트형';
      case 'Oval':
        return '계란형';
      case 'Round':
        return '둥근형';
      case 'Square':
        return '각진형';
      case 'Oblong':
        return '긴 얼굴형';
      default:
        return '';
    }
  };

  const formatProbability = (probability) => {
    return `${(probability * 100).toFixed(2)}%`;
  };

  const openPinterestLink = (query) => {
    window.open(`https://www.pinterest.co.kr/search/pins/?q=${encodeURIComponent(query)}&rs=typed`, '_blank');
  };

  const renderRecommendation = (recommendations) => {
    return recommendations.map((text, index) => (
      <p key={index}>{text}</p>
    ));
  };

  const renderFaceResult = () => {
    const faceShapeName = getFaceShapeName();
    
    return (
      <div className='container'>
        <h5>˖⁺‧₊˚ {faceShapeName} ˚₊‧⁺˖</h5>

        <div className='result-image'>
          {faceImage && <img src={`http://127.0.0.1:8000${faceImage}`} alt="selectedImage" />}
        </div>

        <button className='image-btn' onClick={() => openPinterestLink(`${faceShapeName} 헤어스타일`)}>
          어울리는 헤어스타일 사진 보러가기 
        </button>

        <div className='predictions'>
          {predictions.map((prediction, index) => (
            <div key={index} className='prediction-item'>
              <span className='prediction-type'>{prediction.type}</span>
              <div className='bar-container'>
                <div className='bar' style={{ width: `${prediction.probability * 100}%` }}></div>
              </div>
              <span className='probability'>{formatProbability(prediction.probability)}</span>
            </div>
          ))}
        </div>

        <div className='description'>
          <div className='recommendation'>
            <span>👍🏻 추천</span>
            <br /><br /><br />
            {renderRecommendation(recommendationData[result]?.recommendations || [])}
          </div>
          <div className='decommendation'>
            <span>👎🏻 비추천</span>
            <br /><br /><br />
            {renderRecommendation(recommendationData[result]?.disrecommendations || [])}
          </div>
        </div>

      </div>
    );
  };

  const recommendationData = {
    Heart: {
      recommendations: [
        '- 귀 높이에서부터 웨이브가 들어간 스타일',
        '- 짧은 단발머리에 C컬펌',
        '- 앞머리를 내리거나 턱선 근처 무거운 느낌의 굵은 S컬펌',
        '- 머리를 길게 길러 굵은 웨이브의 볼륨감',
        '- 한쪽으로 넘긴 스타일',
        '- 똥머리, 포니테일',
        '- 턱선에서 어깨 길이에 뱅 스타일',
        '- 넓은 이마는 시스루 뱅 스타일 앞머리로 커버',
        '- 6:4, 7:3 가르마',
      ],
      disrecommendations: [
        '- 앞머리를 일자로 자르거나 스트레이트 헤어',
        '- 짧은 숏컷이나 얼굴 전체를 드러내는 스타일',
        '- 뿌리볼륨',
      ],
    },
    Oval: {
      recommendations: [
        '- 다 좋지만 갸름한 얼굴형을 잘 보여줄 수 있는',
        '- 업 스타일, 포니테일, 컬이 들어간 레이어드 S컬펌',
        '- 중간 길이의 머리에 가벼운 웨이브, 보브컷',
        '- 짧은 커트에 베이비펌, 셋팅펌',
        '- 가르마 6:4, 8:2',
      ],
      disrecommendations: [
        '- 이마를 가리는 무거운 느낌의 뱅',
        '- 너무 긴 머리',
      ],
    },
    Round: {
      recommendations: [
        '- 앞머리를 내는 것보다는 이마를 들어내 길어 보이게 하는 스타일',
        '- 윗머리에 볼륨감',
        '- 턱선까지 오는 단발, 가슴 중간을 넘는 긴 기장',
        '- 레이어드 C컬 펌',
        '- 턱선이나 목선에 맞춘 레이어드 컷',
        '- 앞머리가 없는 긴 웨이브, 이마를 들어낸 긴 생머리',
        '- 높게 묶은 하이 포니테일',
        '- 옆으로 넘길 수 있는 긴 앞머리 스타일',
        '- 한쪽 머리를 귀 뒤로 넘겨주기',
        '- 6:4 가르마'
      ],
      disrecommendations: [
        '- 5:5 가르마 피하기(하고싶다면 지그재그 가르마)',
      ],
    },
    Square: {
      recommendations: [
        '- 턱 쪽 부근의 옆머리에 가볍게 S자 웨이브',
        '- 머리 위쪽에 볼륨을 넣어 부드러운 곡선의 형태의 헤어',
        '- 안쪽으로 말려들어가는 스타일',
        '- S컬 웨이브 펌',
        '- 굵은 웨이브가 들어간 롱 헤어 스타일',
        '- 옆머리를 자연스럽게 빼서 흘러내리듯이 연출하는 업스타일',
        '- 미디엄 길이에 층을 내어 레이어드 C컬 펌',
        '- 턱 아래를 향해 사선으로 내려오는 보브 헤어 스타일',
        '- 6:4 가르마',
      ],
      disrecommendations: [
        '- 앞머리를 짧게 내는 것은 얼굴 각 부각',
        '- 5:5 정가르마, 반듯한 일자 앞머리',
      ],
    },
    Oblong: {
      recommendations: [
        '- 앞머리를 내어 얼굴 길이 보완',
        '- 옆머리에 S자로 자연스러운 웨이브로 볼륨감 주는 스타일',
        '- 미디엄~롱기장의 루즈한 S컬 펌',
        '- 뱅 스타일, 턱선 길이에서 아래쪽에 풍성한 컬',
        '- 옆머리를 층을 내어 커트, 눈썹에 닿는 길이의 가벼운 느낌의 시스루뱅',
        '- 숏컷',
        '- 5:5 가르마 대신 사이드로 머리 몰아주기',
      ],
      disrecommendations: [
        '- 처피뱅 앞머리',
        '- 앞머리가 없는 스트레이트 헤어',
        '- 턱선에 닿는 길이의 단발',
      ],
    },
  };

  return (
    <div className='faceshape'>
      <Nav />
      <p className='main-title'>얼굴형 분석</p>
      <Alert />
      <hr />
      <div className='body-container'>
        <div className='container'>
          {renderFaceResult()}
          <button className='result-btn' onClick={navigateToPrevious}>
            다시 하기
          </button>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default FaceResultPage