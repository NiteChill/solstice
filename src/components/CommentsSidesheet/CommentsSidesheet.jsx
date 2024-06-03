import { useEffect, useState } from 'react';
import styles from './CommentsSidesheet.module.scss';
import IconButton from '../IconButton/IconButton';
import LinearProgressIndicator from '../LinearProgressIndicator/LinearProgressIndicator';
import axios from 'axios';
import Comment from '../Comment/Comment';

export default function CommentsSidesheet({
  isOpen,
  setIsOpen,
  user,
  article,
}) {
  const [sidesheetState, setSidesheetState] = useState(false),
    [loading, setLoading] = useState(false),
    [loadingComment, setLoadingComment] = useState(false),
    [comments, setComments] = useState(null),
    [comment, setComment] = useState(''),
    handleComment = async () => {
      setLoadingComment(true);
      console.log(user?.id, comment, article?._id);
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
      if (response.data?.error) setLoading(false);
      else if (response.data?.comment) {
        setComment('');
        setLoadingComment(false);
        setComments([...comments, response.data?.comment]);
      }
    };
  useEffect(() => {
    comments === null && isOpen &&
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
  }, [isOpen, article]);
  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
  }, [isOpen]);

useEffect(() => setComments(null), [article])
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
            {comments && comments.length ?
              comments?.map((comment) => (
                <Comment comment={comment} key={comment?._id} />
              )) : (
                <p className='body-large'>No comments yet <br /> Be the first one!</p>
              )}
          </main>
          {user?.id && (
            <footer>
              <div>
                <input
                  type='text'
                  placeholder='Share your thoughts'
                  className='body-large'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <IconButton
                  icon='send'
                  iconColor='var(--primary)'
                  stateLayer='primary'
                  onClick={() => comment?.replace(/\s+/g, '') && handleComment()}
                  loading={loadingComment}
                  disabled={!comment?.replace(/\s+/g, '')}
                />
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}