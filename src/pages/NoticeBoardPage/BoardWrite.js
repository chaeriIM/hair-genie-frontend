import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import './BoardWrite.css'
import '../../App.css';

const BoardWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [SubmitPopupOpen, setSubmitPopupOpen] = useState(false);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [customerId, setCustomerId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`http://127.0.0.1:8000/user/`);
                    const userData = response.data;

                    const matchedUser = userData.find((user) => user.uid === userId);

                    if (matchedUser) {
                        // 일치하는 사용자가 있을 경우 해당 ID를 customerId로 설정
                        setCustomerId(matchedUser.id);
                    }
                } else {
                    console.error('사용자 ID가 없습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchLoggedInUser();
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleConfirm = async () => {
        try {
            // 요청 데이터
            const requestData = {
                title: title,
                content: content,
                customer: customerId,
            };
            console.log('requestData:', requestData);

            // 백엔드로 POST 요청 보내기
            const response = await axios.post('http://127.0.0.1:8000/board/', requestData)

            if (response.status === 201) {
                setIsReviewSubmitted(true);

                setTimeout(() => {
                    setSubmitPopupOpen(false);
                    navigate('/noticeboard');
                }, 1800);
            } else {
                console.error('게시글 생성 실패:', response.data);
            }
        } catch (error) {
            console.error('게시글 생성 중 오류 발생:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitPopupOpen(true);
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시글 작성</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='board-write-container'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title"></label>
                            <input className="title-input" placeholder="제목을 입력해주세요." type="text" id="title" value={title} onChange={handleTitleChange} />
                        </div>
                        <div>
                            <label htmlFor="content"></label>
                            <textarea className="content-textarea" placeholder="내용을 입력해주세요." id="content" value={content} onChange={handleContentChange}></textarea>
                        </div>
                        <div className='right-btn'>
                            <button type="submit" className='login-btn' style={{ width: '100px' }}>등록</button>
                        </div>
                    </form>
                    <Popup
                        isOpen={SubmitPopupOpen}
                        message={isReviewSubmitted ? '게시글 작성 완료!' : '게시글을 등록하시겠습니까?'}
                        onConfirm={handleConfirm}
                        onCancel={() => setSubmitPopupOpen(false)}
                        isCompleted={isReviewSubmitted}
                    />
                </div>
            </div>
        </div>
    );
};

export default BoardWrite;
