import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import './BoardDetail.css';
import '../../App.css';

const BoardDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);

    const currentUserId = localStorage.getItem('userId');

    const [isPostDeleted, setIsPostDeleted] = useState(false);
    const [PostDeletePopupOpen, setPostDeletePopupOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/board/${postId}/`)
            .then(response => {
                setPost(response.data);

                // user 정보 가져오기
                axios.get(`http://127.0.0.1:8000/user/${response.data.customer}/`)
                    .then(userResponse => {
                        setUser(userResponse.data);
                    })
                    .catch(error => {
                        console.error('Error fetching user:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [postId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day}.  ${hours}:${minutes}`;
    };

    /* 삭제 */
    const handlePostDelete = () => {
        setPostDeletePopupOpen(true);
    };

    const confirmPostDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/board/${postId}/`);
            if (response.status === 204) {
                setIsPostDeleted(true);

                setTimeout(() => {
                    setPostDeletePopupOpen(false);
                    navigate(`/noticeboard/`);
                }, 1000);
            } else {
                console.error('게시글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버와의 통신 중 오류 발생:', error);
        }
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='board-detail-top-container'>
                    <div className='board-detail-top-btn-container'>
                        <Link to="/noticeboard" className='left-btn' style={{ textDecoration: 'none' }}>
                            <button className='gray-btn' style={{ width: '50px' }} >목록 </button>
                        </Link>
                        {/* 내가 작성한 글인 경우에만 보이는 항목 */}
                        {currentUserId === user?.uid && (
                            <div className='right-btn'>
                                <Link to={`/noticeboard/${post.id}/edit`}>
                                    <button className='gray-btn' style={{ width: '50px' }}>수정</button>
                                </Link>
                                <button className='gray-btn' style={{ width: '50px' }} onClick={handlePostDelete}>삭제</button>                            </div>
                        )}
                    </div>
                    <div className='board-box'>
                        <p className='board-detail-category'>{post?.category}</p>
                        <p className='board-detail-title'>{post?.title}</p>
                        <div className='post-writer-details'>
                            <div className='writer-profile'>
                                <img src={user?.profile_image} alt='Profile' />
                                <p className='writer-info'>{user?.unickname}<br />{formatDate(post?.created_at)}&nbsp;&nbsp;&nbsp;조회 {post?.views_count}</p>
                            </div>
                        </div>
                        <hr className="post-separator" />
                        <div className='post-content-container'>
                            {post ? (
                                <p>{post.content}</p>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <hr className="post-separator" />
                    </div>
                    <Popup
                        isOpen={PostDeletePopupOpen}
                        message={isPostDeleted ? '게시글이 삭제되었습니다.' : '게시글을 삭제하시겠습니까?'}
                        onConfirm={confirmPostDelete}
                        onCancel={() => setPostDeletePopupOpen(false)}
                        isCompleted={isPostDeleted}
                    />
                </div>
            </div>
        </div >
    );
};

export default BoardDetail;
