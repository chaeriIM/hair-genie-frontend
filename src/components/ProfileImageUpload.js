import React, { useState } from 'react';

const ProfileImageUpload = ({ onProfileImageUploaded }) => {
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);

    const handleProfileImageUpload = (event) => {
        const selectedProfile = event.target.files[0];
        if (selectedProfile) {
            const imageUrl = URL.createObjectURL(selectedProfile);
            setSelectedProfileImage(imageUrl);
            localStorage.setItem('uploadedProfileImage', imageUrl);
            onProfileImageUploaded(imageUrl);
        }
    };

    const handleProfileImageClick = () => {
        document.getElementById('Profile-upload-button').click();
    };

    return (
        <div className='profile-image'>
            <div className='profile-image-container' onClick={handleProfileImageClick}>
                {selectedProfileImage ? (
                    <img src={selectedProfileImage} alt="Profile-Uploaded" className="uploaded-Profile-image" />
                ) : (
                    <div className='empty-profile'>
                        프로필 이미지를 등록하세요.
                    </div>
                )}
            </div>
            <input id='Profile-upload-button' type='file' accept='image/*' onChange={handleProfileImageUpload} style={{ display: 'none' }} />
        </div>
    );
}

export default ProfileImageUpload;
