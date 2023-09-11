import React from 'react';
import Modal from 'react-modal';
import './Popup.css'

const Popup = ({ message, onConfirm, onCancel, isOpen, isCompleted }) => {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Popup Modal"
            className="popup-modal"
            overlayClassName="popup-overlay"
        >
            <div className="popup-container">
                <p>{message}</p>
                {!isCompleted && (
                    <div className="button-container">
                        <button onClick={onCancel}>취소</button>
                        <button onClick={handleConfirm}>확인</button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default Popup;