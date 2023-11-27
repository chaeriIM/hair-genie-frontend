import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import './NoticeBoard.css';
import '../../App.css';

const NoticeBoard = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/board/')  
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='noticeboard-container'>
                    {/* '글쓰기' 버튼 */}
                    <Link to="/boardwrite">
                        <button>글쓰기</button>
                    </Link>
                </div>
                {/* posts 상태를 활용하여 게시글 리스트를 출력합니다. */}
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NoticeBoard;
