import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Pagination from 'react-js-pagination';
import './NoticeBoard.css';
import '../../App.css';

const itemsPerPage = 15;

const NoticeBoard = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});

    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [boardTitle, setBoardTitle] = useState('전체 글 보기');
    const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);

    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/board/')
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateB - dateA;
                });
                setPosts(sortedPosts);
                setFilteredPosts(sortedPosts);

                // 공지를 상단에 고정시키기
                const noticePosts = sortedPosts.filter(post => post.category === '공지');
                const otherPosts = sortedPosts.filter(post => post.category !== '공지');
                const combinedPosts = [...noticePosts, ...otherPosts];

                setPosts(combinedPosts);
                setFilteredPosts(combinedPosts);

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

    const handlePostClick = (postId) => {
        // 게시글을 클릭할 때마다 조회수를 업데이트하는 요청
        axios.put(`http://127.0.0.1:8000/board/${postId}/increment-views/`)
            .then(updateResponse => {
                // 조회수가 업데이트된 게시물 정보를 받아옴
                // 이 정보는 BoardDetail에서 사용될 수 있음
                console.log('Updated views count:', updateResponse.data);
            })
            .catch(error => {
                console.error('Error updating views count:', error);
            });
    };

    const toggleCategoryList = () => {
        setIsCategoryListOpen(!isCategoryListOpen);
    };

    const filterPostsByCategory = (category, title) => {
        if (category === '전체') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.category === category);
            setFilteredPosts(filtered);
        }
        setSelectedCategory(category);
        setBoardTitle(title);
    };

    // 페이지네이션 로직
    useEffect(() => {
        const startIndex = (activePage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const slicedPosts = filteredPosts.slice(startIndex, endIndex);
        setPosts(slicedPosts);
    }, [activePage, filteredPosts]);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <div className='board-top-container'>
                    <div className='board-title-container'>
                        <span className='board-title' onClick={toggleCategoryList}>{boardTitle}</span>
                        <span className={`category-arrow${isCategoryListOpen ? ' open' : ''}`} onClick={toggleCategoryList}></span>
                        <div className={`category-filter${isCategoryListOpen ? ' open' : ''}`}>
                            <span className='category' onClick={() => filterPostsByCategory('전체', '전체 글 보기')}>전체</span>
                            <span className='category' onClick={() => filterPostsByCategory('공지', '공지')}>공지</span>
                            <span className='category' onClick={() => filterPostsByCategory('자유', '자유')}>자유</span>
                            <span className='category' onClick={() => filterPostsByCategory('미용실 등록 요청', '미용실 등록 요청')}>미용실 등록 요청</span>
                        </div>
                    </div>
                    <Link to="/boardwrite">
                        <button className='login-btn' style={{ width: '70px' }}>글쓰기</button>
                    </Link>
                </div>
                <hr className="board-separator" />
                <div className='board-body-container'>
                    <div className='board-list-container'>
                        {filteredPosts.length === 0 ? (
                            <p className='no-posts-message'>등록된 게시글이 없습니다.</p>
                        ) : (
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
                                    {filteredPosts.map((post, index) => (
                                        <tr className='board-detail-container' key={post.id}>
                                            {selectedCategory === '전체' ? (
                                                <td className={`board-detail ${post.category === '공지' ? 'notice-category' : ''}`}>{post.category}</td>
                                            ) : (
                                                <td className='board-detail'>{post.id}</td>
                                            )}
                                            <td className='board-detail' style={{ textAlign: 'left' }}>
                                                <Link
                                                    className='board-list-title'
                                                    to={`/noticeboard/${post.id}`}
                                                    onClick={() => handlePostClick(post.id)}
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className='board-detail'>{users[post.customer]?.unickname}</td>
                                            <td className='board-detail'>{formatDate(post.created_at)}</td>
                                            <td className='board-detail'>{post.views_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className='pagination-container'>
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={filteredPosts.length}
                        pageRangeDisplayed={5} // paginator의 페이지 범위
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePageChange}
                    />
                </div>

            </div>
        </div>
    );
};

export default NoticeBoard;