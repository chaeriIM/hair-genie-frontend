import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import './BoardDetail.css';
import '../../App.css';

const BoardDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);

    const currentUserId = localStorage.getItem('userId');

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
                                <button className='gray-btn' style={{ width: '50px' }}>수정</button>
                                <button className='gray-btn' style={{ width: '50px' }}>삭제</button>
                            </div>
                        )}
                    </div>
                    <div className='board-box'>
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
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;
