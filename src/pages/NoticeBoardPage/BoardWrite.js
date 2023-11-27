import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import '../../App.css';

const BoardWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 게시글 데이터
        const newPost = {
            title: title,
            content: content,
        };

        // 게시글 생성 요청
        axios.post('http://localhost:8000/posts/', newPost)
            .then(response => {
                // 게시글 생성 후 작업 수행
                console.log('게시글이 성공적으로 생성되었습니다:', response.data);
                // 추가적인 작업 수행 가능
            })
            .catch(error => {
                console.error('게시글 생성 중 오류 발생:', error);
            });
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시글 작성</p>
            <Alert />
            <hr />
            <div className='body-container'>
                {/* 게시글 입력 폼 */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">제목:</label>
                        <input type="text" id="title" value={title} onChange={handleTitleChange} />
                    </div>
                    <div>
                        <label htmlFor="content">내용:</label>
                        <textarea id="content" value={content} onChange={handleContentChange}></textarea>
                    </div>
                    <button type="submit">글쓰기</button>
                </form>
            </div>
        </div>
    );
};

export default BoardWrite;
