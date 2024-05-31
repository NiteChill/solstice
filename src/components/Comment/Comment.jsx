import axios from 'axios';
import IconButton from '../IconButton/IconButton';
import styles from './Comment.module.scss';
import { useEffect, useState } from 'react';

export default function Comment({ comment }) {
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
    ];
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
    <div className={styles.comment}>
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
              <h2 className='title-medium'>{author?.username}</h2>
            )}
            <p className='body-medium'>{dateTxt}</p>
          </div>
        </div>
        <IconButton icon='more_vert' />
      </div>
      <p>{comment?.content}</p>
    </div>
  );
}
