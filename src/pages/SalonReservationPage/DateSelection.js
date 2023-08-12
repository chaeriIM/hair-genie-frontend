import React from 'react';
import './DateSelection.css';

const DateSelection = ({ selectedSalon }) => {
    return (
        <div className="selected-salon-box">
            <p className="selected-salon-text">{selectedSalon}</p>
        </div>
    );
};

export default DateSelection;
