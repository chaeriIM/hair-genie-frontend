import React, { useState } from 'react';
import moment from 'moment';
import CustomCalendar from '../../components/Calendar';
import './DateSelection.css';

const DateSelection = ({ selectedSalon, setStep }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);

    const [previousSelectedTime, setPreviousSelectedTime] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null); // 날짜 변경 시 선택한 시간 초기화
    };

    const times = Array(11)
        .fill()
        .map((_, index) => {
            return 10 + index + ":00";
        });

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDateTime = new Date(selectedDate);
        const [hours, minutes] = time.split(':');
        selectedDateTime.setHours(parseInt(hours));
        selectedDateTime.setMinutes(parseInt(minutes));

        return currentDate.getTime() < selectedDateTime.getTime();
    };

    const handleSelectTime = (time) => {
        if (filterPassedTime(time)) {
            setSelectedTime(time === selectedTime ? null : time);
            if (selectedTime) {
                setPreviousSelectedTime(selectedTime);
            }
        }
    };

    const handleNextClick = () => {
        if (selectedTime) {
            setStep(3);
        }
    };

    return (
        <div className="date-selection-container">
            <div className="selected-salon-box">
                <p className="selected-salon-text">{selectedSalon}</p>
                <div className={`selected-date ${selectedTime || previousSelectedTime ? 'time-selected' : ''}`}>
                    {moment(selectedDate).format("MM월 DD일")}
                </div>
                <div className="selected-time">{selectedTime}</div>
            </div>
            <div className="calendar">
                <CustomCalendar selectedDate={selectedDate} handleDateChange={handleDateChange} />
            </div>
            <div className="time-options">
                <div className="time-buttons">
                    {times.map((time) => (
                        <button
                            key={time}
                            onClick={() => handleSelectTime(time)}
                            className={selectedTime === time ? 'selected' : ''}
                            disabled={!filterPassedTime(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
                <button
                    className="next-button"
                    onClick={handleNextClick}
                    disabled={!selectedTime}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default DateSelection;
