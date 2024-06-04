import { useEffect, useRef, useState } from 'react';
import styles from './CommentsSidesheet.module.scss';
import IconButton from '../IconButton/IconButton';
import LinearProgressIndicator from '../LinearProgressIndicator/LinearProgressIndicator';
import axios from 'axios';
import Comment from '../Comment/Comment';
import DeleteModal from '../DeleteModale/DeleteModal';

export default function CommentsSidesheet({
  isOpen,
  setIsOpen,
  user,
  article,
}) {
  const [sidesheetState, setSidesheetState] = useState(false),
    [editComment, setEditComment] = useState(false),
    [loading, setLoading] = useState(false),
    [loadingComment, setLoadingComment] = useState(false),
    [comments, setComments] = useState(null),
    [comment, setComment] = useState(''),
    [isOpenDelete, setIsOpenDelete] = useState(false),
    [toDeleteComment, setToDeleteComment] = useState(null),
    commentInputRef = useRef(null),
    handleDelete = async () => {
      if (toDeleteComment?.authorId !== user?.id) return;
      const response = await axios.post(
        'http://localhost:3000/api/delete_comment',
        { id: toDeleteComment?._id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) {
        console.log(response.data.error);
        setToDeleteComment(null);
        setIsOpenDelete(false);
      } else {
        setComments(comments?.filter((el) => el?._id !== toDeleteComment?._id));
        setToDeleteComment(null);
        setIsOpenDelete(false);
      }
    },
    handleComment = async () => {
      setLoadingComment(true);
      const response = await axios.post(
        'http://localhost:3000/api/create_comment',
        { id: user?.id, content: comment, articleId: article?._id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) setLoadingComment(false);
      else if (response.data?.comment) {
        setComment('');
        setLoadingComment(false);
        setComments([...comments, response.data?.comment]);
      }
    },
    handleEdit = async () => {
      if (editComment?.authorId !== user?.id) return;
      setLoadingComment(true);
      const response = await axios.post(
        'http://localhost:3000/api/update_comment',
        { id: editComment?._id, content: comment },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data?.error) setLoadingComment(false);
      else {
        setComment('');
        setLoadingComment(false);
        setComments([...comments.filter((el) => el._id !== editComment?._id), {
          ...editComment,
          content: comment,
        }]);
        setEditComment(false);
      }
    };
  useEffect(() => {
    comments === null &&
      isOpen &&
      (async function getComments() {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:3000/api/get_comments',
          { id: article?._id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data?.error) setLoading(false);
        else if (response.data?.comments) {
          setComments(response.data.comments);
          setLoading(false);
        }
      })();
    setEditComment(false);
  }, [isOpen, article]);
  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
  }, [isOpen]);

  useEffect(() => setComments(null), [article]);

  useEffect(() => {
    setComment(editComment ? editComment?.content : '');
    editComment && isOpen && commentInputRef.current.focus();
  }, [editComment]);
  return (
    <>
      <div
        className={styles.backdrop}
        onClick={() => setIsOpen(false)}
        style={{ opacity: isOpen && 0.5, top: sidesheetState && 0 }}
      ></div>
      <div
        className={`${styles.container} ${isOpen ? styles.open : undefined}`}
        style={{
          width:
            window.innerWidth < 500
              ? '100%'
              : window.innerWidth < 1000 &&
                (sidesheetState ? 'clamp(0px, 100%, 21.25rem)' : 0),
        }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>Comments</h1>
            <IconButton icon='close' onClick={() => setIsOpen(false)} />
            {loading && <LinearProgressIndicator />}
          </header>
          <main>
            {comments && comments.length ? (
              comments?.map((comment) => (
                <Comment
                  key={comment?._id}
                  comment={comment}
                  userId={user?.id}
                  comments={comments}
                  setComments={setComments}
                  edit={editComment}
                  setEdit={setEditComment}
                  setIsOpenDelete={setIsOpenDelete}
                  setToDeleteComment={setToDeleteComment}
                />
              ))
            ) : (
              <p className='body-large'>
                No comments yet <br /> Be the first one!
              </p>
            )}
          </main>
          {user?.id && (
            <footer>
              <div>
                <input
                  ref={commentInputRef}
                  type='text'
                  placeholder='Share your thoughts'
                  className='body-large'
                  value={comment}
                  onInput={(e) => setComment(e.target.value)}
                />
                {editComment ? (
                  <IconButton
                    icon='done'
                    iconColor='var(--primary)'
                    stateLayer='primary'
                    onClick={handleEdit}
                    loading={loadingComment}
                  />
                ) : (
                  <IconButton
                    icon='send'
                    iconColor='var(--primary)'
                    stateLayer='primary'
                    onClick={() =>
                      comment?.replace(/\s+/g, '') && handleComment()
                    }
                    loading={loadingComment}
                    disabled={!comment?.replace(/\s+/g, '')}
                  />
                )}
              </div>
            </footer>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        onSubmit={handleDelete}
      />
    </>
  );
}
