import React from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
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

    // 요일 순서 변경을 위한 설정
    const locale = 'ko-KR';
    const weekStartDay = 0;

    // 상단 버튼에 달만 표시
    const navigationLabel = () => {
        const month = selectedDate.getMonth() + 1;
        return `${month}월`;
    };

    return (
        <div>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={tileDisabled}
                locale={locale}
                calendarType="US" // 요일 순서 일~토로 변경하기 위해서
                calendarStartDay={weekStartDay}
                formatDay={(locale, date) => moment(date).format("D")} // 달력에서 '일' 생략
                navigationLabel={navigationLabel} // 상단 버튼 수정하기

            />
        </div>
    );


}

export default CustomCalendar;
