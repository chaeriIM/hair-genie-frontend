/*global kakao*/
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './Loading';
import './Map.css';

const Map = () => {
  const [salons, setSalons] = useState([]);
  const [initialPosition, setInitialPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 사용자의 현재 위치
  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          // console.log('사용자의 현재 위치: ', latitude, longitude);
          setInitialPosition(new kakao.maps.LatLng(latitude, longitude));
          setLoading(false);
        },
        error => {
          console.error('사용자 위치를 가져오는 중 오류 발생:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('이 브라우저에서는 지오로케이션이 지원되지 않습니다.');
      setLoading(false);
    }
  }

  useEffect(() => {
    // 미용실 데이터를 가져옴
    axios.get('http://127.0.0.1:8000/hairsalon/')
      .then(response => {
        setSalons(response.data);
      })
      .catch(error => {
        console.error('Error fetching salon data:', error);
      });

      fetchUserLocation();
  }, []);

  const createMarkers = useCallback(async (map, bounds) => {
    // 기존 미용실 목록 비우기
    const salonList = document.getElementById('salon-list');
    salonList.innerHTML = '';

    for (const salon of salons) {
      try {
        const result = await geocode(salon.HLoc);
        const salonLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);

        // LatLngBounds에 속하는 미용실만 표시
        if (bounds.contain(salonLatLng)) {
          const marker = new kakao.maps.Marker({
            position: salonLatLng,
            map: map,
            title: salon.HName,
            image: new kakao.maps.MarkerImage('/images/salonicon.png', new kakao.maps.Size(48, 48))
          });

          // 마커 클릭 시 인포윈도우 표시
          kakao.maps.event.addListener(marker, 'click', function () {
            const infowindow = new kakao.maps.InfoWindow({
              content: `<div class="salon-info">
                          <div class="salon-name">
                            <strong>${salon.HName}</strong>
                          </div>
                          <br />
                          <div class="salon-loc">
                            주소: ${salon.HLoc}
                          </div>
                        </div>`,
              removable: true
            });
            infowindow.open(map, marker);
          });

          // 미용실 목록 추가
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${salon.HName}</strong>
            <div class="salon-loc">주소: ${salon.HLoc}</div>
          `;
          listItem.addEventListener('click', () => {
            map.setCenter(salonLatLng);
            map.setLevel(3);
          });
          salonList.appendChild(listItem);
        }
      } catch (error) {
        console.error(`미용실 주소 (${salon.HLoc})의 위도 및 경도를 가져오는 중 오류 발생:`, error);
      }
    }
  }, [salons]);

  const initializeMap = useCallback(() => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: initialPosition,
      level: 3
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    setMapInstance(map);

    // 지도 컨트롤 추가
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 중심을 기반으로 LatLngBounds 객체 생성
    let bounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(initialPosition.getLat() - 0.01, initialPosition.getLng() - 0.01),
      new kakao.maps.LatLng(initialPosition.getLat() + 0.01, initialPosition.getLng() + 0.01)
    );

    createMarkers(map, bounds);
    
    kakao.maps.event.addListener(map, 'dragend', function () {
      const newCenter = map.getCenter();
      bounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(newCenter.getLat() - 0.01, newCenter.getLng() - 0.01),
        new kakao.maps.LatLng(newCenter.getLat() + 0.01, newCenter.getLng() + 0.01)
      );
      // console.log(newCenter.getLat(), newCenter.getLng());
      createMarkers(map, bounds);
    });
  }, [initialPosition, createMarkers]);

  // 지오코딩을 Promise로 감싸주는 함수
  // 미용실 주소를 이용하여 위도와 경도를 얻어옴
  const geocode = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve(result);
        } else {
          reject(status);
        }
      });
    });
  };

  useEffect(() => {
    if (initialPosition) {
      initializeMap();
    }
  }, [initialPosition, initializeMap, salons]);

  // 나의 위치 버튼 클릭
  const handleMyLocationClick = () => {
    if (mapInstance && initialPosition) {
      mapInstance.setCenter(initialPosition);
      mapInstance.setLevel(3);

      const newBounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(initialPosition.getLat() - 0.01, initialPosition.getLng() - 0.01),
        new kakao.maps.LatLng(initialPosition.getLat() + 0.01, initialPosition.getLng() + 0.01)
      );

      createMarkers(mapInstance, newBounds);
    }
  };

  return (
    <>
      {loading ? (
        <Loading message='지도 로드 중' />
      ) : (
        <div className='total_wrap'>
          <div id="map" style={{ width: '100%', height: '500px' }}></div>
          <button className='current-btn' onClick={handleMyLocationClick}>
            <img src='/images/currenticon.png' alt='현재 위치 아이콘' />
            <span>나의 위치</span>
          </button>
          <div className='salon-wrap'>
            <div className='list-title'>주변 미용실 목록</div>
            <ul id="salon-list"></ul>
          </div>
        </div>
      )}
    </> 
  );
};

export default Map;