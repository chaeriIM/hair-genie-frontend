import React from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const CustomCalendar = ({ selectedDate, handleDateChange }) => {
    return (
        <div>
            <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
    );
}

export default CustomCalendar;