import React from 'react';
import moment from 'moment';
import './ServiceMenuSelection.css';

const ServiceMenuSelection = ({ selectedSalon, selectedDate, selectedTime }) => {
    return (
        <div>
            <div className="selected-salon-box">
                <p className="selected-salon-text">{selectedSalon}</p>
                <div className="time-selected-date">{moment(selectedDate).format("MM월 DD일")}</div>
                <div className="selected-time">{selectedTime}</div>
            </div>
            <hr className="mini-separator" />
        </div>
    );
};

export default ServiceMenuSelection;
