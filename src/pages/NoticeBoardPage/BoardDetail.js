import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import Chatbot from '../../components/Chatbot';
import Loading from '../../components/Loading';
import Pagination from 'react-js-pagination';
import './BoardDetail.css';
import '../../App.css';

const BoardDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 댓글
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerNickname, setCustomerNickname] = useState('');
    const [customerImg, setCustomerImg] = useState('');

    const [editCommentContent, setEditCommentContent] = useState('');
    const [isCommentDeleted, setIsCommentDeleted] = useState(false);
    const [CommentDeletePopupOpen, setCommentDeletePopupOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    // 대댓글
    const [newReply, setNewReply] = useState('');
    const [selectedComment, setSelectedComment] = useState(null);
    const [replyInputVisible, setReplyInputVisible] = useState(false);

    const [editReplyContent, setEditReplyContent] = useState('');
    const [isReplyEditing, setIsReplyEditing] = useState(false);
    const [selectedReplyId, setSelectedReplyId] = useState(null);
    const [isReplyDeleted, setIsReplyDeleted] = useState(false);
    const [ReplyDeletePopupOpen, setReplyDeletePopupOpen] = useState(false);

    // 댓글 페이징
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;
    const totalCommentPages = Math.ceil(comments.length / itemsPerPage);

    const currentUserId = localStorage.getItem('userId');

    const [isPostDeleted, setIsPostDeleted] = useState(false);
    const [PostDeletePopupOpen, setPostDeletePopupOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setActivePage(totalCommentPages);

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
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching comments:', error);
                        setLoading(false);
                    });

            })
            .catch(error => {
                console.error('Error fetching post:', error);
                setLoading(false);
            });
    }, [postId, totalCommentPages]);

    /* 
        댓글
    */
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


    /* 
        대댓글
    */
    // 대댓글 입력창 열기
    const openReplyInput = (comment) => {
        setSelectedComment(comment);
        setNewReply('');
        setReplyInputVisible(true);
    };

    // 대댓글 작성
    const handleReplySubmit = () => {
        axios.post(`http://127.0.0.1:8000/board/${postId}/comments/`, {
            comment: newReply,
            board: postId,
            customer: customerId,
            parent_comment: selectedComment.id,
        })
            .then(response => {
                // 대댓글 목록 갱신
                setComments((prevComments) => {
                    const updatedComments = prevComments.map(comment =>
                        comment.id === selectedComment.id
                            ? { ...comment, replies: [...comment.replies, response.data] }
                            : comment
                    );
                    return updatedComments;
                });

                setNewReply('');
                setSelectedComment(null);
                setReplyInputVisible(false);
            })
            .catch(error => {
                console.error('Error submitting reply:', error);
            });
    };

    // 대댓글 수정 버튼 클릭 시
    const handleEditReplyClick = (replyId, currentContent, commentId) => {
        // 편집 모드로 변경
        setIsReplyEditing(true);
        setSelectedReplyId(replyId);
        setEditReplyContent(currentContent);

        // 대댓글이 속한 댓글을 선택
        setSelectedComment(comments.find(comment => comment.id === commentId));
    };

    // 대댓글 수정 완료 버튼 클릭 시
    const handleEditReplyComplete = () => {
        // 수정된 내용 서버로 전송
        axios.put(`http://127.0.0.1:8000/board/${postId}/comments/${selectedReplyId}/`, {
            comment: editReplyContent,
            board: postId,
            customer: customerId,
        })
            .then(response => {
                // 편집 모드 해제하고 화면 갱신
                setComments((prevComments) => {
                    const updatedComments = prevComments.map(comment =>
                        comment.id === selectedComment.id
                            ? {
                                ...comment, replies: comment.replies.map(reply =>
                                    reply.id === selectedReplyId
                                        ? { ...reply, comment: editReplyContent, isEditing: false }
                                        : reply
                                )
                            }
                            : comment
                    );
                    return updatedComments;
                });
                setIsReplyEditing(false);
                setEditReplyContent('');
            })
            .catch(error => {
                console.error('Error updating reply:', error);
            });
    };

    // 대댓글 취소 버튼 클릭 시
    const handleCancelEditReply = () => {
        setIsReplyEditing(false);
        setEditReplyContent('');
    };

    // 대댓글 삭제 버튼 클릭 시
    const handleDeleteReply = (replyId, commentId) => {
        axios.delete(`http://127.0.0.1:8000/board/${postId}/comments/${replyId}/`)
            .then(response => {
                setIsReplyDeleted(true);
                // 삭제된 대댓글 화면에서 제거
                setComments((prevComments) => {
                    const updatedComments = prevComments.map(comment =>
                        comment.id === commentId
                            ? { ...comment, replies: comment.replies.filter(reply => reply.id !== replyId) }
                            : comment
                    );
                    return updatedComments;
                });

                setTimeout(() => {
                    setReplyDeletePopupOpen(false);
                }, 1000);
            })
            .catch(error => {
                console.error('Error deleting reply:', error);
            });
    };

    const openReplyDeletePopup = (replyId, commentId) => {
        setSelectedReplyId(replyId);
        setSelectedCommentId(commentId);
        setReplyDeletePopupOpen(true);
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
                        setCustomerId(matchedUser.id);
                        setCustomerNickname(matchedUser.unickname);
                        setCustomerImg(matchedUser.profile_image);
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

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    // 댓글 + 답글 수
    const totalComments = comments.reduce((acc, comment) => acc + 1 + comment.replies.length, 0);

    return (
        <div className='noticeboard'>
            <Nav />
            <p className='main-title'>게시판</p>
            <Alert />
            <hr />
            <div className='body-container'>
                {loading ? (
                    <Loading message='로딩 중' />
                ) : (
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
                                    <p>{post.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}</p>
                                ) : (
                                    null
                                )}
                            </div>
                            <hr className="post-separator" />

                            {/* 댓글 */}
                            <div className='comment'>
                                <p className='comment-title'>댓글 {totalComments}</p>
                                <div className='comment-list'>
                                    {comments
                                        .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                                        .map(comment => (
                                            <div key={comment.id} className='comment-item'>
                                                <div className='writer-profile'>
                                                    {!comment.isEditing && (
                                                        <img src={`https://hairgenie-bucket.s3.ap-northeast-2.amazonaws.com/${comment.user_profile_image}`} alt='Profile' />
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
                                                                <p className='comment-content'>{comment.comment.split('\n').map((line, index) => (
                                                                    <React.Fragment key={index}>
                                                                        {line}
                                                                        <br />
                                                                    </React.Fragment>
                                                                ))}</p>
                                                                <div className='btn-container'>
                                                                    <p className='created-at'>{formatDate(comment.created_at)}</p>
                                                                    <button onClick={() => openReplyInput(comment)} style={{ fontSize: '11px' }}>답글</button>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* 대댓글 입력창 */}
                                                        {replyInputVisible && selectedComment && selectedComment.id === comment.id && (
                                                            <div className='update-input reply-input' style={{ marginTop: '10px' }}>
                                                                <textarea
                                                                    rows='4'
                                                                    value={newReply}
                                                                    onChange={(e) => setNewReply(e.target.value)}
                                                                    placeholder='답글을 입력해주세요.'
                                                                />
                                                                <div className='btn-container'>
                                                                    <button className='btn-cancel' onClick={() => setReplyInputVisible(false)}>취소</button>
                                                                    <button className='btn-update' onClick={handleReplySubmit}>등록</button>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>

                                                    {comment.customer === customerId && !comment.isEditing && (
                                                        <div className='btn-container'>
                                                            <button onClick={() => handleEditClick(comment.id, comment.comment)}>수정</button>
                                                            <button onClick={() => openCommentDeletePopup(comment.id)}>삭제</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 대댓글 표시 */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className='replies'>
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} className='comment-item'>
                                                                <div className='writer-profile'>
                                                                    <img src={`https://hairgenie-bucket.s3.ap-northeast-2.amazonaws.com/${reply.user_profile_image}`} alt='Profile' />
                                                                    <div className='comment-info'>
                                                                        <p className='user-name'>{reply.user_name}</p>

                                                                        {isReplyEditing && selectedReplyId === reply.id ? (
                                                                            <div className='update-input'>
                                                                                <textarea
                                                                                    rows='4'
                                                                                    value={editReplyContent}
                                                                                    onChange={(e) => setEditReplyContent(e.target.value)}
                                                                                />
                                                                                <div className='btn-container'>
                                                                                    <button className='btn-cancel' onClick={handleCancelEditReply}>취소</button>
                                                                                    <button className='btn-update' onClick={handleEditReplyComplete}>수정</button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <p className='comment-content'>{reply.comment.split('\n').map((line, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {line}
                                                                                        <br />
                                                                                    </React.Fragment>
                                                                                ))}</p>
                                                                                <p className='created-at'>{formatDate(reply.created_at)}</p>
                                                                            </>
                                                                        )}

                                                                    </div>
                                                                    {/* 본인이 작성한 대댓글인 경우에만 수정/삭제 버튼 표시 */}
                                                                    {reply.customer === customerId && !isReplyEditing && (
                                                                        <div className='btn-container'>
                                                                            <button onClick={() => handleEditReplyClick(reply.id, reply.comment, comment.id)}>수정</button>
                                                                            <button onClick={() => openReplyDeletePopup(reply.id, comment.id)}>삭제</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                </div>

                                {/* 댓글 페이징 처리 */}
                                {totalCommentPages > 1 && (
                                    <Pagination
                                        activePage={activePage}
                                        itemsCountPerPage={itemsPerPage}
                                        totalItemsCount={comments.length}
                                        pageRangeDisplayed={5}
                                        prevPageText={"<"}
                                        nextPageText={">"}
                                        onChange={handlePageChange}
                                    />
                                )}

                                {/* 댓글 입력창 */}
                                <div className='comment-input'>
                                    <div className='writer-profile' style={{ paddingBottom: '10px' }}>
                                        <img src={`${customerImg}`} alt='Profile' />
                                        <p className='user-name' style={{ fontWeight: 450, color: '#82b1ff' }}>{customerNickname}</p>
                                    </div>
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
                            <Popup
                                isOpen={ReplyDeletePopupOpen}
                                message={isReplyDeleted ? '답글이 삭제되었습니다.' : '답글을 삭제하시겠습니까?'}
                                onConfirm={() => handleDeleteReply(selectedReplyId, selectedCommentId)}
                                onCancel={() => setReplyDeletePopupOpen(false)}
                                isCompleted={isReplyDeleted}
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
                )}
            </div>
            <Chatbot />
        </div >
    );
};

export default BoardDetail;