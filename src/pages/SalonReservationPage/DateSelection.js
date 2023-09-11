import React, { useState } from 'react';
import moment from 'moment';
import CustomCalendar from '../../components/Calendar';
import './DateSelection.css';

const DateSelection = ({ selectedSalon, setStep, setSelectedDate, setSelectedTime }) => {
    const [selectedDateLocal, setSelectedDateLocal] = useState(new Date());
    const [selectedTimeLocal, setSelectedTimeLocal] = useState(null);
    const [previousSelectedTime, setPreviousSelectedTime] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDateLocal(date);
        setSelectedTimeLocal(null); // 날짜 변경 시 선택한 시간 초기화
    };

    const times = Array(11)
        .fill()
        .map((_, index) => {
            return 10 + index + ":00";
        });

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDateTime = new Date(selectedDateLocal);
        const [hours, minutes] = time.split(':');
        selectedDateTime.setHours(parseInt(hours));
        selectedDateTime.setMinutes(parseInt(minutes));

        return currentDate.getTime() < selectedDateTime.getTime();
    };

    const handleSelectTime = (time) => {
        if (filterPassedTime(time)) {
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
                <p className="salon-name">{selectedSalon}</p>
                <div className={`selected-date ${selectedTimeLocal ? 'time-selected-date' : ''}`}>
                    {moment(selectedDateLocal).format("MM월 DD일")}
                </div>
                {(selectedTimeLocal || previousSelectedTime) && (
                    <div className="selected-time">{selectedTimeLocal}</div>
                )}
            </div>
            <div className="options-container">
                <div className="calendar">
                    <CustomCalendar selectedDate={selectedDateLocal} handleDateChange={handleDateChange} />
                </div>
                <div className="time-options">
                    <div className="time-buttons">
                        {times.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleSelectTime(time)}
                                className={selectedTimeLocal === time ? 'selected' : ''}
                                disabled={!filterPassedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
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
