/*global kakao*/
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loading from './Loading';
import './Map.css';

const Map = () => {
  const [salons, setSalons] = useState([]);
  const [initialPosition, setInitialPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 미용실 데이터를 가져옴
    axios.get('http://127.0.0.1:8000/hairsalon/')
      .then(response => {
        setSalons(response.data);
      })
      .catch(error => {
        console.error('Error fetching salon data:', error);
      });
    
    // 사용자의 현재 위치
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('사용자의 현재 위치', latitude, longitude);
          setInitialPosition(new kakao.maps.LatLng(latitude, longitude));
          setLoading(false);
        },
        error => {
          console.error('Error getting user location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 사용자의 현재 위치를 기반으로 지도에 마커를 표시
    if (initialPosition) {
      // console.log('사용자 중심', initialPosition);
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: initialPosition,
        level: 3
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      setMapInstance(map);
      
      // 지도 컨트롤
      const mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      // 지도 중심을 기반으로 LatLngBounds 객체 생성
      const bounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(initialPosition.getLat() - 0.05, initialPosition.getLng() - 0.05),
        new kakao.maps.LatLng(initialPosition.getLat() + 0.05, initialPosition.getLng() + 0.05)
      );

      

      salons.forEach(salon => {
        // 미용실 주소를 이용하여 위도와 경도를 얻어옴
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(salon.HLoc, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const salonLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            // LatLngBounds에 속하는 미용실만 표시
            if (bounds.contain(salonLatLng)) {
              // 마커 생성
              const markerImage = new kakao.maps.MarkerImage(
                '/images/salonicon.png', new kakao.maps.Size(48, 48));
  
              const marker = new kakao.maps.Marker({
                position: salonLatLng,
                map: map,
                title: salon.HName,
                image: markerImage
              });
  
              // console.log('Marker created:', marker.getPosition());
  
              // 마커 클릭 시 인포윈도우 표시
              kakao.maps.event.addListener(marker, 'click', function() {
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
              
              // 미용실 목록 표시 element
              const salonList = document.getElementById('salon-list');
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
          }
        });
      });
    }
  }, [initialPosition, salons]);

  const handleMyLocationClick = () => {
    if (mapInstance && initialPosition) {
      // 현재 위치로 지도의 중심 이동
      mapInstance.setCenter(initialPosition);
      // 지도 레벨을 3으로 변경
      mapInstance.setLevel(3);
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
  )
};

export default Map