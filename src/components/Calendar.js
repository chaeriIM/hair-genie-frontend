import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './Calendar.css';

const CustomCalendar = ({ selectedDate, handleDateChange }) => {
    const tileDisabled = ({ date }) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const currentYear = currentDate.getFullYear();
    
        const selectedYear = date.getFullYear();
    
        return selectedYear < currentYear;
    };
    
    const locale = 'ko-KR';
    const weekStartDay = 0;

    const [view, setView] = useState('month');

    const navigationLabel = ({ date }) => {
        if (view === 'year') {
            return `${date.getFullYear()}년`;
        } else if (view === 'decade') {
            return `${date.getFullYear() - 9}년 - ${date.getFullYear()}`;
        } else {
            return `${date.getMonth() + 1}월`;
        }
    };

    return (
        <div>
            <Calendar
                onChange={(value, event) => {
                    if (view === 'month') {
                        handleDateChange(value);
                    } else {
                        setView('month');
                    }
                }}
                onActiveStartDateChange={({ view }) => {
                    setView(view);
                }}
                value={selectedDate}
                tileDisabled={tileDisabled}
                locale={locale}
                calendarType="US"
                calendarStartDay={weekStartDay}
                formatDay={(locale, date) => moment(date).format("DD")}
                navigationLabel={navigationLabel}
                view={view}
                showNavigation={view === 'month' || view === 'year'} // 월 뷰와 연도 뷰에서만 네비게이션 표시
            />
        </div>
    );
}

export default CustomCalendar;
