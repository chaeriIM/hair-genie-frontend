import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import './NoticeBoard.css';
import '../../App.css';

const NoticeBoard = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/board/')
            .then(response => {
                setPosts(response.data);

                // user 정보 가져오기
                const userIds = response.data.map(post => post.customer);
                fetchUsers(userIds);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const fetchUsers = (userIds) => {
        axios.get(`http://127.0.0.1:8000/user/?id__in=${userIds.join(',')}`)
            .then(response => {
                const usersData = response.data.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsers(usersData);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='board-top-container'>
                    <p className='board-title'>전체 글 보기</p>
                    <Link to="/boardwrite">
                        <button className='login-btn' style={{ width: '80px' }}>글쓰기</button>
                    </Link>
                </div>
                <hr className="board-separator" />
                <div className='board-list-container'>
                    {/* 전체 글 목록 테이블 */}
                    <table className='board-table'>
                        <thead>
                            <tr className='board-item-container'>
                                <th className='board-item'></th>
                                <th className='board-item'>제목</th>
                                <th className='board-item'>작성자</th>
                                <th className='board-item'>작성일</th>
                                <th className='board-item'>조회</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr className='board-detail-container' key={post.id}>
                                    <td className='board-detail'>{index + 1}</td>
                                    <td className='board-detail' style={{ textAlign: 'left' }}>
                                        <Link to={`/noticeboard/${post.id}`}>{post.title}</Link></td>
                                    <td className='board-detail'>{users[post.customer]?.unickname}</td>
                                    <td className='board-detail'>{formatDate(post.created_at)}</td>
                                    <td className='board-detail'>{post.views_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
