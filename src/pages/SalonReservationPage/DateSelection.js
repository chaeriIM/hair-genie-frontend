import React from 'react';

const DateSelection = ({ selectedSalon }) => {
    return (
        <div>
            <p>날짜 선택</p>
            <p>선택한 미용실: {selectedSalon}</p>
        </div>
    );
};

export default DateSelection;
