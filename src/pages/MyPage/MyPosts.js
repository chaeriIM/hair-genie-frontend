import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import Pagination from 'react-js-pagination';
import '../../App.css';

const itemsPerPage = 15;

const MyPosts = () => {
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);

    const userId = localStorage.getItem('userId');

    const [isPostDeleted, setIsPostDeleted] = useState(false);
    const [PostDeletePopupOpen, setPostDeletePopupOpen] = useState(false);

    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/board/');
                const sortedPosts = response.data.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateB - dateA;
                });

                const userDataResponse = await axios.get('http://127.0.0.1:8000/user/');
                const userDataArray = userDataResponse.data;

                // 'userId'와 일치하는 사용자 데이터 찾기
                const matchedUser = userDataArray.find((user) => user.uid === userId);

                // 사용자 데이터에서 ID 추출
                const customerId = matchedUser.id;

                // 게시글 중 현재 사용자의 것만 필터링
                const userPosts = sortedPosts.filter(post => post.customer === customerId);
                setFilteredPosts(userPosts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 페이지네이션 로직
    const indexOfLastPost = activePage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    // 삭제 
    const handleCheckboxChange = (postId) => {
        // 체크 박스가 선택되었는지 확인하여 해당 게시글 ID를 추가하거나 제거합니다.
        const updatedSelectedPosts = selectedPosts.includes(postId)
            ? selectedPosts.filter((selectedId) => selectedId !== postId)
            : [...selectedPosts, postId];
        setSelectedPosts(updatedSelectedPosts);
    };

    const handlePostDelete = () => {
        setPostDeletePopupOpen(true);
    };

    const confirmPostDelete = async () => {
        try {
            await Promise.all(
                selectedPosts.map(async (selectedPostId) => {
                    const response = await axios.delete(`http://127.0.0.1:8000/board/${selectedPostId}/`);
                    if (response.status !== 204) {
                        console.error(`게시글 ${selectedPostId} 삭제에 실패했습니다.`);
                    }
                })
            );
            setIsPostDeleted(true);

            setTimeout(() => {
                setPostDeletePopupOpen(false);
                // 선택된 게시글 초기화
                setSelectedPosts([]);

                // 페이지 새로고침
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('서버와의 통신 중 오류 발생:', error);
        }
    };

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>내가 쓴 게시글</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <hr className="board-separator" />
                <div className='board-body-container'>
                    <div className='board-list-container'>
                        {currentPosts.length === 0 ? (
                            <p className='no-posts-message'>등록된 게시글이 없습니다.</p>
                        ) : (
                            <table className='board-table'>
                                <thead>
                                    <tr className='board-item-container'>
                                        <th className='board-item'></th>
                                        <th className='board-item'></th>
                                        <th className='board-item'>제목</th>
                                        <th className='board-item'>작성일</th>
                                        <th className='board-item'>조회</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPosts.map((post, index) => (
                                        <tr className='board-detail-container' key={post.id}>
                                            <td className='board-detail'>
                                                <input
                                                    type='checkbox'
                                                    onChange={() => handleCheckboxChange(post.id)}
                                                    checked={selectedPosts.includes(post.id)}
                                                />
                                            </td>
                                            <td className='board-detail'>{post.id}</td>
                                            <td className='board-detail' style={{ textAlign: 'left' }}>
                                                <Link
                                                    className='board-list-title'
                                                    to={`/noticeboard/${post.id}`}
                                                >
                                                    {post.title} <span style={{ color: '#82b1ff' }}>[{post.comment_count}]</span>
                                                </Link>
                                            </td>
                                            <td className='board-detail'>{formatDate(post.created_at)}</td>
                                            <td className='board-detail'>{post.views_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className='right-btn' style={{ minWidth: '800px', width: '60%' }}>
                    <Link to="/boardwrite"><button className='gray-btn' style={{ width: '60px' }}>글쓰기</button></Link>
                    <button className='gray-btn' style={{ width: '50px' }} onClick={handlePostDelete}>삭제</button>
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
                <Popup
                    isOpen={PostDeletePopupOpen}
                    message={isPostDeleted ? '게시글이 삭제되었습니다.' : '게시글을 삭제하시겠습니까?'}
                    onConfirm={confirmPostDelete}
                    onCancel={() => setPostDeletePopupOpen(false)}
                    isCompleted={isPostDeleted}
                />
            </div>
        </div >
    );
};

export default MyPosts;
