import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import Loading from '../../components/Loading';
import Pagination from 'react-js-pagination';
import '../../App.css';

const itemsPerPage = 15;

const MyComments = () => {
    const userId = localStorage.getItem('userId');

    const [userCommentedPosts, setPostsWithUserComments] = useState([]);
    const [SelectedBoardId, setSelectedBoardId] = useState([]);

    const [userComments, setUserComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);

    const [isCommentDeleted, setIsCommentDeleted] = useState(false);
    const [CommentDeletePopupOpen, setCommentDeletePopupOpen] = useState(false);

    const [activePage, setActivePage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [postsResponse, userDataResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8000/board/'),
                axios.get('http://127.0.0.1:8000/user/')
            ]);

            const posts = postsResponse.data;

            // 사용자 데이터에서 현재 사용자 정보만 가져오기
            const matchedUser = userDataResponse.data.find((user) => user.uid === userId);
            const customerId = matchedUser.id;

            // 현재 사용자의 댓글 데이터 가져오기
            const userCommentsResponse = await axios.get(`http://127.0.0.1:8000/board/comments/${customerId}/`);
            const userCommentsData = userCommentsResponse.data.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            });

            // 현재 사용자가 댓글 작성한 게시글 필터링
            const userCommentedPosts = posts.filter(post =>
                userCommentsData.some(comment => comment.board === post.id)
            );

            setUserComments(userCommentsData);
            setPostsWithUserComments(userCommentedPosts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [userId, fetchData]);

    // 이전에 가져온 게시글 데이터에서 해당 게시글의 제목과 댓글 수를 가져오기 위한 함수
    const getPostTitleAndCommentCount = (postId) => {
        const post = userCommentedPosts.find((post) => post.id === postId);
        return {
            title: post.title,
            commentCount: post.comment_count,
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 페이지네이션 로직
    const indexOfLastComment = activePage * itemsPerPage;
    const indexOfFirstComment = indexOfLastComment - itemsPerPage;
    const currentComments = userComments.slice(indexOfFirstComment, indexOfLastComment);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    // 삭제 
    const handleCheckboxChange = (commentId, commentBoard) => {
        const isSelected = selectedComments.includes(commentId);
        let updatedSelectedComments = [];

        if (isSelected) {
            updatedSelectedComments = selectedComments.filter((selectedId) => selectedId !== commentId);
        } else {
            updatedSelectedComments = [...selectedComments, commentId];
        }

        setSelectedComments(updatedSelectedComments);

        // 선택된 댓글의 comment.board 값을 selectedBoardId로 저장
        setSelectedBoardId(commentBoard);
    };


    const handleCommentDelete = () => {
        setCommentDeletePopupOpen(true);
    };

    const confirmCommentDelete = async () => {
        try {
            await Promise.all(
                selectedComments.map(async (selectedCommentId) => {
                    const response = await axios.delete(`http://127.0.0.1:8000/board/${SelectedBoardId}/comments/${selectedCommentId}/`);
                    if (response.status !== 204) {
                        console.error(`댓글 ${selectedCommentId} 삭제에 실패했습니다.`);
                    }
                })
            );
            setIsCommentDeleted(true);

            setTimeout(() => {
                setCommentDeletePopupOpen(false);
                // 선택된 댓글 초기화
                setSelectedComments([]);

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
            <p className='main-title'>내가 쓴 댓글</p>
            <Alert />
            <hr />
            <div className='body-container'>
                <hr className="board-separator" />
                <div className='board-body-container'>
                    <div className='board-list-container'>
                        {loading ? (
                            <Loading message='로딩 중' />
                        ) : userCommentedPosts.length === 0 ? (
                            <p className='no-posts-message'>등록된 댓글이 없습니다.</p>
                        ) : (
                            <table className='board-table'>
                                <thead>
                                    <tr className='board-item-container'>
                                        <th className='board-item'></th>
                                        <th className='board-item'>댓글</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentComments.map((comment) => (
                                        <tr className='board-detail-container' key={comment.id}>
                                            <td className='board-detail'>
                                                <input
                                                    type='checkbox'
                                                    onChange={() => handleCheckboxChange(comment.id, comment.board)}
                                                    checked={selectedComments.includes(comment.id)}
                                                />
                                            </td>
                                            <td className='comment-list-box'>
                                                <Link className='board-list-title' to={`/noticeboard/${comment.board}`} >
                                                    <p className='board-detail' style={{ textAlign: 'left', padding: '0', marginBottom: '-5px' }}>{comment.comment.split('\n').map((line, index) => (
                                                        <React.Fragment key={index}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}</p>
                                                    <p className='board-detail' style={{ color: '#888', textAlign: 'left', fontSize: '12px', padding: '0', marginBottom: '-10px' }}>{formatDate(comment.created_at)}</p>
                                                    {/* 해당 댓글이 속한 게시글의 제목과 댓글 수 표시 */}
                                                    <p className='board-detail' style={{ color: '#888', textAlign: 'left', fontSize: '12px', padding: '0' }}>
                                                        {getPostTitleAndCommentCount(comment.board)?.title}{' '}
                                                        <span style={{ color: '#82b1ff' }}>
                                                            [{getPostTitleAndCommentCount(comment.board)?.commentCount}]
                                                        </span>
                                                    </p>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className='right-btn' style={{ minWidth: '800px', width: '60%' }}>
                    <Link to="/boardwrite"><button className='gray-btn' style={{ width: '60px' }}>글쓰기</button></Link>
                    <button className='gray-btn' style={{ width: '50px' }} onClick={handleCommentDelete}>삭제</button>
                </div>
                <div className='pagination-container'>
                    {userComments.length > itemsPerPage && (
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={userComments.length}
                            pageRangeDisplayed={5}
                            prevPageText={"<"}
                            nextPageText={">"}
                            onChange={handlePageChange}
                        />
                    )}
                </div>
                <Popup
                    isOpen={CommentDeletePopupOpen}
                    message={
                        isCommentDeleted
                            ? '댓글이 삭제되었습니다.'
                            : selectedComments.length === 0
                                ? '삭제할 댓글을 선택해주세요.'
                                : '댓글을 삭제하시겠습니까?'
                    }
                    onConfirm={selectedComments.length !== 0 ? confirmCommentDelete : () => setCommentDeletePopupOpen(false)}
                    onCancel={() => setCommentDeletePopupOpen(false)}
                    isCompleted={isCommentDeleted}
                />
            </div>
        </div >
    );
};

export default MyComments;