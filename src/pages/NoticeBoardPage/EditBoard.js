import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import Chatbot from '../../components/Chatbot';
import '../../App.css';

const EditBoard = () => {
    const [category, setCategory] = useState('');
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [user, setUser] = useState([]);

    const [SubmitPopupOpen, setSubmitPopupOpen] = useState(false);
    const [isPostSubmitted, setIsPostSubmitted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // 게시글 정보를 불러와서 수정을 위한 초기 데이터 설정
        axios.get(`http://127.0.0.1:8000/board/${postId}/`)
            .then(response => {
                setTitle(response.data.title);
                setContent(response.data.content);
                setCategory(response.data.category);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [postId]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");

                const response = await axios.get("http://127.0.0.1:8000/user/info/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // 요청 헤더에 액세스 토큰 포함
                    },
                });

                setUser(response.data);

            } catch (error) {
                console.error("사용자 정보를 가져오는데 실패했습니다.", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleEditPost = async () => {
        const userId = user.id
        try {
            const response = await axios.put(`http://127.0.0.1:8000/board/${postId}/`, {
                category: category,
                title: title,
                content: content,
                customer: userId,
            });

            if (response.status === 200) {
                setIsPostSubmitted(true);

                setTimeout(() => {
                    setSubmitPopupOpen(false);
                    navigate(`/noticeboard/${postId}`);
                }, 1800);
            } else {
                console.error('게시글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('게시글 수정 중 오류 발생:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitPopupOpen(true);
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='board-write-container'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="category"></label>
                            <select
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                                className='category-container' 
                            >
                                <option value="">게시판을 선택해주세요.</option>
                                <option value="공지">공지</option>
                                <option value="자유">자유</option>
                                <option value="미용실 등록 요청">미용실 등록 요청</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="title"></label>
                            <input
                                placeholder="제목을 입력해주세요."
                                type="text"
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                className='title-input'
                            />
                        </div>
                        <div>
                            <label htmlFor="content"></label>
                            <textarea
                                placeholder="내용을 입력해주세요."
                                id="content"
                                value={content}
                                onChange={handleContentChange}
                                className='content-textarea'
                            ></textarea>
                        </div>
                        <div className='right-btn'>
                            <button type="submit" className='login-btn' style={{ width: '100px' }}>등록</button>
                        </div>
                    </form>
                    <Popup
                        isOpen={SubmitPopupOpen}
                        message={isPostSubmitted ? '게시글 수정 완료!' : '게시글을 수정하시겠습니까?'}
                        onConfirm={handleEditPost}
                        onCancel={() => setSubmitPopupOpen(false)}
                        isCompleted={isPostSubmitted}
                    />
                </div>
            </div>
            <Chatbot />
        </div>
    );
};

export default EditBoard;
