import axios from 'axios';
import IconButton from '../IconButton/IconButton';
import styles from './Comment.module.scss';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';

export default function Comment({
  comment,
  userId,
  comments,
  setComments,
  edit,
  setEdit,
}) {
  const [author, setAuthor] = useState([]),
    [loading, setLoading] = useState(false),
    month = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ],
    handleDelete = async () => {
      if (comment?.authorId !== userId) return;
      const response = await axios.post(
        'http://localhost:3000/api/delete_comment',
        { id: comment?._id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) {
        console.log(response.data.error);
      } else {
        setComments(comments?.filter((el) => el?._id !== comment?._id));
      }
    };
  useEffect(() => {
    (async function getCommentAuthor() {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/get_comment_author',
        { id: comment?.authorId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) setLoading(false);
      else if (response.data?.author) {
        setAuthor(response.data.author);
        setLoading(false);
      }
    })();
  }, [comment]);
  let dateTxt;
  if (comment?.createdAt) {
    let monthNbr = comment?.createdAt.slice(5, 7);
    if (monthNbr.slice(0, 1) === '0') monthNbr = monthNbr.slice(1, 2);
    dateTxt = `${comment?.createdAt.slice(11, 16)} ${
      month[monthNbr - 1]
    } ${comment?.createdAt.slice(8, 10)}, ${comment?.createdAt.slice(0, 4)}`;
  }
  return (
    <div
      className={`${styles.comment} ${
        comment === edit ? styles.edit : undefined
      }`}
    >
      <div>
        <div>
          {author?.profile_picture ? (
            <img src={author?.profile_picture} alt='avatar' />
          ) : (
            <div className={styles.avatar}>
              <span className='material-symbols-outlined'>person</span>
            </div>
          )}
          <div className={styles.info}>
            {loading ? (
              <div>
                <div></div>
              </div>
            ) : (
              <h2
                className='title-medium'
                style={{
                  color: userId === comment?.authorId && 'var(--primary)',
                }}
              >
                {userId === comment?.authorId ? 'You' : author?.username}
              </h2>
            )}
            <p className='body-medium'>{dateTxt}</p>
          </div>
        </div>
        {userId === comment?.authorId &&
          (comment === edit ? (
          <IconButton icon='edit_off' onClick={() => setEdit(false)} />
          // <Button icon='close' label='Discard' onClick={() => setEdit(false)} />
          ) : (
            <div
              className={styles.dropdown}
              onClick={(e) => {
                if (e.currentTarget === document.activeElement)
                  e.currentTarget.removeAttribute('tabindex');
                else {
                  e.currentTarget.setAttribute('tabindex', -1);
                  e.currentTarget.focus();
                }
              }}
              onBlur={(e) => e.currentTarget.removeAttribute('tabindex')}
            >
              <IconButton icon='more_vert' />
              <div className={styles.menu}>
                <div onClick={() => setEdit(comment)}>
                  <span className='material-symbols-outlined'>edit</span>
                  <p className='body-large'>Edit</p>
                </div>
                <div onClick={handleDelete}>
                  <span className='material-symbols-outlined'>delete</span>
                  <p className='body-large'>Delete</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <p>{comment?.content}</p>
    </div>
  );
}
