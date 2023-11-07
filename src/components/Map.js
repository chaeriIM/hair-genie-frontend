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
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: initialPosition,
        level: 3
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      setMapInstance(map);
      
      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new kakao.maps.MapTypeControl();

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      salons.forEach(salon => {
        // 미용실 주소를 이용하여 위도와 경도를 얻어옴
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(salon.HLoc, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const latlng = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            const markerImage = new kakao.maps.MarkerImage(
              '/images/salonicon.png', new kakao.maps.Size(48, 48));

            const marker = new kakao.maps.Marker({
              position: latlng,
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
          }
        });
      });
    }
  }, [initialPosition, salons]);

  const handleMyLocationClick = () => {
    if (mapInstance && initialPosition) {
      // 현재 위치로 지도의 중심 이동
      mapInstance.setCenter(initialPosition);
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
      </div>
    )}
    </> 
  )
};

export default Map