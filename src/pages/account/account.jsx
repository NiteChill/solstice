import { useLocation, useOutletContext } from 'react-router-dom';
import styles from './account.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';

export default function Account() {
  const [
      user,
      setUser,
      edit,
      setEdit,
      article,
      setArticle,
      editor,
      isOpenLink,
      setIsOpenLink,
      isOpenImage,
      setIsOpenImage,
      loading,
      setLoading,
      appWidth,
      isOpenMenu,
      tags,
      isOpenCreateSidesheet,
    ] = useOutletContext(),
    [page, setPage] = useState('my_articles'),
    [articles, setArticles] = useState([]);
  useEffect(() => {
    (async function getArticlesByCategories() {
      setLoading(true);
      let response;
      if (page === 'my_articles') {
        response = await axios.post(
          'http://localhost:3000/api/get_articles_by_user',
          { id: user?.id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      } else if (page === 'liked_articles') {
        response = await axios.post(
          'http://localhost:3000/api/get_articles_by_likes',
          { id: user?.id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      }
      if (response.data?.error) console.log(response.data.error);
      else if (response.data?.articles) {
        setLoading(false);
        setArticles(response.data.articles);
      }
    })();
  }, [page]);
  return (
    <div className={styles.account}>
      <main>
        <label htmlFor='profile_picture'>
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt='profile_picture '
            />
          ) : (
            <div>
              <span className='material-symbols-outlined'>person</span>
            </div>
          )}
          <input
            type='file'
            accept='image/*'
            id='profile_picture'
          />
        </label>
        <div className={styles.user_info}>
          <h1 className='headline-medium'>{`${user?.first_name} ${user?.last_name}`}</h1>
          <p className='body-large'>@{user?.username}</p>
        </div>
        <nav>
          <Tab
            label='My articles'
            active={page === 'my_articles'}
            onClick={() => setPage('my_articles')}
          />
          <Tab
            label='Liked articles'
            active={page === 'liked_articles'}
            onClick={() => setPage('liked_articles')}
          />
          {/* <Tab label='My comments' active={location === '/account/my_comments'} />
            <Tab label='Liked comments' active={location === '/account/liked_comments'} /> */}
        </nav>
        <div
          className={`${styles.articles} ${
            isOpenCreateSidesheet ? styles.open : ''
          }`}
        >
          {articles?.map((article) => (
            <ArticlePreview
              key={article.title}
              article={article}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function Tab({ label, active = false, onClick }) {
  return (
    <div
      className={`${styles.tab} ${active ? styles.active : undefined}`}
      onClick={onClick}
    >
      <div>
        <div>
          <p className='title-small'>{label}</p>
          <div></div>
        </div>
      </div>
    </div>
  );
}
