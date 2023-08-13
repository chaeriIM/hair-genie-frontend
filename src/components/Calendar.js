import React from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const CustomCalendar = ({ selectedDate, handleDateChange }) => {
    // 전부 지난 날짜의 달과 연도를 비활성화하는 함수
    const tileDisabled = ({ date }) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const selectedMonth = date.getMonth();
        const selectedYear = date.getFullYear();

        return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth);
    };

    return (
        <div>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={tileDisabled}
            />
        </div>
    );
}

export default CustomCalendar;
