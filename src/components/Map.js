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

    const iwContent = '';
    const iwRemoveable = true;

    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable
    });

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
            let content = `<div class="salon-info">
                            <div class="salon-name">
                              <strong>${salon.HName}</strong>
                            </div>
                            <br />
                            <div class="salon-loc">
                              ${salon.HLoc}
                            </div>
                            <div class="salon-tel">
                              ${salon.HPhone}
                            </div>
                          </div>`

            infowindow.setContent(content);
            infowindow.open(map, marker);
          });

          // 미용실 목록 추가
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${salon.HName}</strong>
            <div class="salon-loc">${salon.HLoc}</div>
            <div class="salon-tel-mini">${salon.HPhone}</div>
          `;
          // 목록 클릭
          listItem.addEventListener('click', () => {
            map.setCenter(salonLatLng);
            map.setLevel(3);
            let content = `<div class="salon-info">
                            <div class="salon-name">
                              <strong>${salon.HName}</strong>
                            </div>
                            <br />
                            <div class="salon-loc">
                              ${salon.HLoc}
                            </div>
                            <div class="salon-tel">
                              ${salon.HPhone}
                            </div>
                          </div>`

            infowindow.setContent(content);
            infowindow.open(map, marker);
          });
          salonList.appendChild(listItem);
        }
      } catch (error) {
        console.error(`미용실 주소 (${salon.HLoc})의 위도 및 경도를 가져오는 중 오류 발생:`, error);
      }
    }
  }, [salons]);

  // 실제 미용실 불러오기(마커)
  const realSalon = useCallback((map, center) => {
    // 장소 검색 객체
    const ps = new kakao.maps.services.Places();
    let markers = [];

    const iwContent = '';
    const iwRemoveable = true;

    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable
    });

    searchPlaces();

    // 키워드 검색 요청 함수
    async function searchPlaces() {
      const keyword = "미용실";
      var options = {
        location: center,
        radius: 10000,
        sort: kakao.maps.services.SortBy.DISTANCE,
      };
      ps.keywordSearch(keyword, placesSearchCB, options);
    }

    // 장소검색 완료됐을 때 호출되는 콜백함수
    function placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);

      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;

      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }

    // 검색 결과 목록 마커 표출 함수
    function displayPlaces(places) {
      const fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds();

      removeMarker();

      for (let i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = addMarker(placePosition, i),
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        let title = places[i].place_name;
        let address = places[i].road_address_name;
        let phone = places[i].phone;
        let url = places[i].place_url;

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        (function (marker, title, address, phone, url) {
          kakao.maps.event.addListener(marker, 'click', function () {
            displayInfowindow(marker, title, address, phone, url);
          });

          itemEl.addEventListener('click', function () {
            displayInfowindow(marker, title, address, phone, url);
          });

        })(marker, title, address, phone, url);

        fragment.appendChild(itemEl);
      }
      map.setBounds(bounds);
    }

    function getListItem(index, places) {

      let el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
          '<div class="info">' +
          '   <h5>' + places.place_name + '</h5>';

      if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
          '   <span class="jibun gray">' + places.address_name + '</span>';
      } else {
        itemStr += '    <span>' + places.address_name + '</span>';
      }

      itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    }

    function addMarker(position, idx, title) {
      var imageSrc = '/images/salonicon.png',
        imageSize = new kakao.maps.Size(48, 48),
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
          position: position,
          image: markerImage
        });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker);  // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    function displayInfowindow(marker, title, address, phone, url) {
      let content = '<div class="salon-info" style="width: 350px";>' +
        '<div class="salon-name">' +
        '<strong>' +
        title +
        '</strong>' +
        '</div>' +
        '<br />' +
        '<div class="salon-loc">' +
        address +
        '</div>';
      if (phone) {
        content += '<div class="tel">' + phone + '</div>';
      }

      content += '<a href="' + url + '" target="_blank">' +
        '자세히 보기' +
        '</a>' +
        '</div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);
    }
  }, []);

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

    // 지도 중심
    let center = new kakao.maps.LatLng(initialPosition.getLat(), initialPosition.getLng());

    // 지도 중심을 기반으로 LatLngBounds 객체 생성
    let bounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(initialPosition.getLat() - 0.01, initialPosition.getLng() - 0.01),
      new kakao.maps.LatLng(initialPosition.getLat() + 0.01, initialPosition.getLng() + 0.01)
    );

    createMarkers(map, bounds);
    realSalon(map, center);

    kakao.maps.event.addListener(map, 'dragend', function () {
      const newCenter = map.getCenter();
      const newBounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(newCenter.getLat() - 0.01, newCenter.getLng() - 0.01),
        new kakao.maps.LatLng(newCenter.getLat() + 0.01, newCenter.getLng() + 0.01)
      );

      createMarkers(map, newBounds);
      realSalon(map, newCenter);
    });
  }, [initialPosition, createMarkers, realSalon]);

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

      // setNewPosition(initialPosition);
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
            <div className='list-title'>✄ 주변 미용실 목록 ✄</div>
            <ul id="salon-list"></ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Map;