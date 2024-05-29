import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from './account.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';
import IconButton from '../../components/IconButton/IconButton';

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
      isOpenFilterSidesheet,
      setIsOpenFilterSidesheet,
    ] = useOutletContext(),
    navigate = useNavigate(),
    [page, setPage] = useState('articles'),
    [myArticles, setMyArticles] = useState([]),
    [likedArticles, setLikedArticles] = useState([]),
    handleProfilePicture = async (file) => {
      if (user?.id) {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:3000/api/update_profile_picture',
          { id: user?.id, profile_picture: file },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data?.error) console.log(response.data.error);
        else if (response.data?.status === 'ok') {
          setUser({...user, profile_picture: file });
          setLoading(false);
        }
      }
    };
  useEffect(() => {
    if (!myArticles.length || !likedArticles.length) {
      (async function getArticlesByCategories() {
        setLoading(true);
        let response;
        if (page === 'articles') {
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
        } else if (page === 'likes') {
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
          page === 'articles'
            ? setMyArticles(response.data.articles)
            : setLikedArticles(response.data.articles);
        }
      })();
    }
  }, [page]);
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, []);
  return (
    <div className={styles.account}>
      <main>
        <label htmlFor='profile_picture'>
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt='profile_picture ' />
          ) : (
            <div className={styles.profile_picture}>
              <span className='material-symbols-outlined'>person</span>
            </div>
          )}
          <input
            type='file'
            accept='image/*'
            id='profile_picture'
            onInput={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.addEventListener('load', (event) => {
                console.log('hey');
                handleProfilePicture(event.target.result);
              });
              reader.readAsDataURL(file);
            }}
          />
          <IconButton icon='edit' />
        </label>
        <div className={styles.user_info}>
          <h1 className='headline-medium'>{`${user?.first_name} ${user?.last_name}`}</h1>
          <p className='body-large'>@{user?.username}</p>
        </div>
        <nav>
          <Tab
            label='Articles'
            active={page === 'articles'}
            onClick={() => setPage('articles')}
          />
          <Tab
            label='Likes'
            active={page === 'likes'}
            onClick={() => setPage('likes')}
          />
          {/* <Tab label='My comments' active={location === '/account/my_comments'} />
            <Tab label='Liked comments' active={location === '/account/liked_comments'} /> */}
        </nav>
        <div
          className={`${styles.articles} ${
            isOpenCreateSidesheet || isOpenFilterSidesheet ? styles.open : ''
          }`}
        >
          {page === 'articles'
            ? myArticles.map((article) => (
                <ArticlePreview key={article.title} article={article} />
              ))
            : likedArticles?.map((article) => (
                <ArticlePreview key={article.title} article={article} />
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
