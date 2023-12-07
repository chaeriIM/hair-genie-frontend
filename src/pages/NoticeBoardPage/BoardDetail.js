import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import Pagination from 'react-js-pagination';
import './BoardDetail.css';
import '../../App.css';

const BoardDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [editCommentContent, setEditCommentContent] = useState('');
    const [isCommentDeleted, setIsCommentDeleted] = useState(false);
    const [CommentDeletePopupOpen, setCommentDeletePopupOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

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
                
                // 댓글 불러오기
                axios.get(`http://127.0.0.1:8000/board/${postId}/comments/`)
                    .then(response => {
                        setComments(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching comments:', error);
                    });
                
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [postId]);

    const handleCommentSubmit = () => {
        // 새 댓글 작성 및 댓글 목록 갱신
        axios.post(`http://127.0.0.1:8000/board/${postId}/comments/`, 
            { 
                comment: newComment,
                board: postId,
                customer: customerId,
            })
            .then(response => {
                setComments([...comments, response.data]);
                setNewComment('');
            })
            .catch(error => {
                console.error('Error submitting comment:', error);
            });
    };

    // 수정 버튼 클릭 시 편집 모드 전환
    const handleEditClick = (commentId, currentContent) => {
        // 편집 모드로 변경
        setComments(comments.map(comment =>
            comment.id === commentId ? { ...comment, isEditing: true } : comment
        ));

        setEditCommentContent(currentContent);
    };

    // 수정 완료 버튼 클릭 시
    const handleEditComplete = (commentId) => {
        // 수정된 내용 서버로 전송
        axios.put(`http://127.0.0.1:8000/board/${postId}/comments/${commentId}/`, {
            comment: editCommentContent,
            board: postId,
            customer: customerId,
        })
        .then(response => {
            // 편집 모드 해제하고 화면 갱신
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, isEditing: false, comment: editCommentContent } : comment
            ));
        })
        .catch(error => {
            console.error('Error updating comment:', error);
        });
    };

    // 취소 버튼 클릭 시 편집 모드 해제
    const handleCancelEdit = (commentId) => {
        setComments(comments.map(comment =>
            comment.id === commentId ? { ...comment, isEditing: false } : comment
        ));
    };

    // 삭제 버튼 클릭 시
    const handleDeleteComment = (commentId) => {
        axios.delete(`http://127.0.0.1:8000/board/${postId}/comments/${commentId}/`)
            .then(response => {
                setIsCommentDeleted(true);
                // 삭제된 댓글 화면에서 제거
                setComments(comments.filter(comment => comment.id !== commentId));
                
                setTimeout(() => {
                    setCommentDeletePopupOpen(false);
                }, 1000);
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    const openCommentDeletePopup = (commentId) => {
        setSelectedCommentId(commentId);
        setCommentDeletePopupOpen(true);
    };

    // 로그인한 유저
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day}.  ${hours}:${minutes}`;
    };

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
                    
                        {/* 댓글 */}
                        <div className='comment'>
                            <p className='comment-title'>댓글 {comments.length}</p>
                            <div className='comment-list'>
                                {comments
                                    .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                                    .map(comment => (
                                    <div key={comment.id} className='comment-item'>
                                        <div className='writer-profile'>
                                            {!comment.isEditing && (
                                                <img src={`http://127.0.0.1:8000/media/${comment.user_profile_image}`} alt='Profile' />
                                            )}
                                            <div className='comment-info'>
                                                <p className='user-name'>{comment.user_name}</p>

                                                {comment.isEditing ? (
                                                    <div className='update-input'>
                                                        <textarea
                                                            rows='4'
                                                            value={editCommentContent}
                                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                                        />
                                                        <div className='btn-container'>
                                                            <button className='btn-cancel' onClick={() => handleCancelEdit(comment.id)}>취소</button>
                                                            <button className='btn-update' onClick={() => handleEditComplete(comment.id)}>수정</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className='comment-content'>{comment.comment}</p>
                                                        <p className='created-at'>{formatDate(comment.created_at)}</p>
                                                    </>
                                                )}
                                                
                                            </div>
                                                
                                            {comment.customer === customerId && !comment.isEditing && (
                                                <div className='btn-container'>
                                                    <button onClick={() => handleEditClick(comment.id, comment.comment)}>수정</button>
                                                    <button onClick={() => openCommentDeletePopup(comment.id)}>삭제</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 댓글 페이징 처리 */}
                            <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={comments.length}
                                pageRangeDisplayed={5}
                                prevPageText={"<"}
                                nextPageText={">"}
                                onChange={handlePageChange}
                            />

                            {/* 댓글 입력창 */}
                            <div className='comment-input'>
                                <textarea
                                    rows='4'
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder='댓글을 입력해주세요.'
                                />
                                <button onClick={handleCommentSubmit}>등록</button>
                            </div>

                        </div>

                        <Popup
                            isOpen={CommentDeletePopupOpen}
                            message={isCommentDeleted ? '댓글이 삭제되었습니다.' : '댓글을 삭제하시겠습니까?'}
                            onConfirm={() => handleDeleteComment(selectedCommentId)}
                            onCancel={() => setCommentDeletePopupOpen(false)}
                            isCompleted={isCommentDeleted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;
