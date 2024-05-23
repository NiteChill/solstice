import axios from 'axios';
import styles from './ArticlePreview.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArticlePreview({ article }) {
  const [username, setUsername] = useState(''),
    [loading, setLoading] = useState(false),
    [self, setSelf] = useState(false),
    navigate = useNavigate();
  useEffect(() => {
    (async function getUsernameById() {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/get_username_by_id',
        { id: article.authorId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) console.log(response.data.error);
      else if (response.data?.self) {
        setLoading(false);
        setSelf(true);
        setUsername('You');
      }
      else if (response.data?.username) {
        setLoading(false);
        setUsername(response.data.username);
      }
    })();
  }, [article]);
  return (
    <div
      className={styles.article_preview}
      onClick={() => navigate(`/article/${article._id}`)}
    >
      {article?.thumbnail && (
        <img src={article.thumbnail} alt={article.title} />
      )}
      <div>
        <h2 className='title-large'>{article.title}</h2>
        <div>
          {loading ? <div><div></div></div> : <p className={`label-large ${self ? styles.self : undefined}`}>{username}</p>}
          <span></span>
          <p className='label-large'>{article.likes.length} like{article.likes.length > 1 && 's'}</p>
          <p className='label-large'>{article.comments}</p>
        </div>
      </div>
    </div>
  );
}
