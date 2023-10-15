import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import CustomCalendar from '../../components/Calendar';
import './DateSelection.css';

const DateSelection = ({ selectedSalon, setStep, setSelectedDate, setSelectedTime }) => {
    moment.locale('ko');
    const { HName, HID } = selectedSalon;

    const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());
    const [selectedTimeLocal, setSelectedTimeLocal] = useState(null);
    const [previousSelectedTime, setPreviousSelectedTime] = useState(null);
    const [reservations, setReservations] = useState([]); // 모든 예약 정보를 저장할 상태
    const [availableTimes, setAvailableTimes] = useState([]); // 예약 가능한 시간대를 저장할 상태

    const handleDateChange = (date) => {
        setSelectedDateLocal(date);
        setSelectedTimeLocal(null); // 날짜 변경 시 선택한 시간 초기화
    };

    const startTime = moment('10:30', 'HH:mm');
    const endTime = moment('20:30', 'HH:mm');
    const timeInterval = 30;

    const times = useMemo(() => {
        const timeList = [];
        let currentTime = startTime.clone();

        while (currentTime.isBefore(endTime)) {
            timeList.push(currentTime.format('HH:mm'));
            currentTime.add(timeInterval, 'minutes');
        }

        return timeList;
    }, [startTime, endTime, timeInterval]);

    // 오전과 오후로 시간을 분할
    const morningTimes = times.filter(time => moment(time, 'HH:mm').isBefore(moment('12:00', 'HH:mm')));
    const afternoonTimes = times.filter(time => moment(time, 'HH:mm').isSameOrAfter(moment('12:00', 'HH:mm')));

    const formatTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm').replace(/\s/g, '');
    };

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDateTime = new Date(selectedDateLocal);
        const [hours, minutes] = time.split(':');
        selectedDateTime.setHours(parseInt(hours));
        selectedDateTime.setMinutes(parseInt(minutes));

        return currentDate.getTime() < selectedDateTime.getTime();
    };

    useEffect(() => {
        // 서버에서 모든 예약 정보를 가져오는 API 호출
        const fetchAllReservations = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/reservation`);
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    throw new Error('API 요청에 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllReservations();
    }, []);

    useEffect(() => {
        // 선택한 날짜에 대한 예약 정보 필터링
        const reservationsForSelectedDate = reservations.filter((reservation) => {
            return moment(reservation.date).isSame(selectedDateLocal, 'day') && reservation.salon === HID && reservation.status === '예약 중';
        });

        // 예약 가능한 시간대 계산
        const maxCapacity = 1; // 최대 예약 가능한 인원 수
        const availableTimes = times.filter((time) => {
            const reservationsForTime = reservationsForSelectedDate.filter((reservation) => {
                return reservation.time === time;
            });
            return reservationsForTime.length < maxCapacity;
        });

        setAvailableTimes(availableTimes);
    }, [selectedDateLocal, reservations, times, HID]);

    const handleSelectTime = (time) => {
        if (filterPassedTime(time) && availableTimes.includes(time)) {
            if (selectedTimeLocal === time) {
                setSelectedTimeLocal(null);
            } else {
                setSelectedTimeLocal(time);
                setPreviousSelectedTime(selectedTimeLocal);
            }
        }
    };

    const handleNextClick = () => {
        if (selectedTimeLocal) {
            setSelectedDate(selectedDateLocal);
            setSelectedTime(selectedTimeLocal);
            setStep(3);
        }
    };

    return (
        <div className='body-container'>
            <div className="selected-salon-box">
                <p className="salon-name">{HName}</p>
                <div className={`selected-date ${selectedTimeLocal ? 'time-selected-date' : ''}`}>
                    {moment(selectedDateLocal).format("MM월 DD일")}
                </div>
                {(selectedTimeLocal || previousSelectedTime) && (
                    <div className="selected-time">
                        {moment(selectedTimeLocal || previousSelectedTime, 'HH:mm').format('a h:mm')}
                    </div>
                )}
            </div>
            <div className="options-container">
                <div className="calendar">
                    <CustomCalendar selectedDate={selectedDateLocal} handleDateChange={handleDateChange} />
                </div>
                <div className="time-options">
                    <div className="time-buttons">
                        <div className="morning-times">
                            <p className="time-title">오전</p>
                            {morningTimes.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleSelectTime(time)}
                                    className={`time-button ${selectedTimeLocal === time ? 'selected' : ''}`}
                                    disabled={!filterPassedTime(time) || !availableTimes.includes(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        <div className="afternoon-times">
                            <p className="time-title">오후</p>
                            {afternoonTimes.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleSelectTime(time)}
                                    className={`time-button ${selectedTimeLocal === time ? 'selected' : ''}`}
                                    disabled={!filterPassedTime(time) || !availableTimes.includes(time)}
                                >
                                    {formatTime(time)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        className="next-button"
                        onClick={handleNextClick}
                        disabled={!selectedTimeLocal}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DateSelection;