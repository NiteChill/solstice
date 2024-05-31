import styles from './ArticleHeader.module.scss';
import IconButton from '../IconButton/IconButton';
import axios from 'axios';
import { useState } from 'react';

export default function ArticleHeader({
  avatar = false,
  name,
  date,
  likes = 0,
  liked = false,
  id,
  article,
  setArticle,
  noAccountAction,
  location,
  isOpenCommentsSidesheet,
  setIsOpenCommentsSidesheet,
}) {
  const month = [
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
    [loadingLike, setLoadingLike] = useState(false),
    handleLike = async () => {
      setLoadingLike(true);
      if (liked) {
        const response = await axios.post(
          'http://localhost:3000/api/unLike',
          { id: id, article: article },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data?.error) console.log(response.data.error);
        else {
          const arr = article?.likes,
            index = arr.indexOf(id);
          arr.splice(index, 1);
          setArticle({ ...article, likes: arr });
          setLoadingLike(false);
        }
      } else {
        const response = await axios.post(
          'http://localhost:3000/api/like',
          { id: id, article: article },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data?.error) console.log(response.data.error);
        else if (article?.likes) {
          setArticle({ ...article, likes: [...article?.likes, id] });
          setLoadingLike(false);
        }
      }
    };
  let dateTxt;
  if (date) {
    let monthNbr = date.slice(5, 7);
    if (monthNbr.slice(0, 1) === '0') monthNbr = monthNbr.slice(1, 2);
    dateTxt = `${month[monthNbr - 1]} ${date.slice(8, 10)}, ${date.slice(
      0,
      4
    )}`;
  }
  return (
    <div className={styles.header}>
      <h1
        className={window.innerWidth > 400 ? 'display-large' : 'display-small'}
      >
        {article?.title}
      </h1>
      <p className='body-large'>{dateTxt}</p>
      <footer>
        <div className={styles.user}>
          <div className={styles.profile_picture}>
            {avatar ? (
              <img src={avatar} alt='Profile' />
            ) : (
              <div>
                <span className='material-symbols-outlined'>person</span>
              </div>
            )}
          </div>
          <h3 className='body-large'>{name}</h3>
        </div>
        <div className={styles.container}>
          <IconButton
            icon='favorite'
            label={likes}
            stateLayer='error'
            iconColor={liked && 'var(--error)'}
            fill={liked && true}
            onClick={() =>
              !loadingLike && (id ? handleLike() : noAccountAction())
            }
            loading={loadingLike}
          />
          {!isOpenCommentsSidesheet && (
            <IconButton
              icon='comment'
              onClick={() =>
                setIsOpenCommentsSidesheet(true)
              }
            />
          )}
          <IconButton
            icon='share'
            onClick={() =>
              navigator.canShare({
                title: article?.title,
                url: location.search,
              }) &&
              navigator.share({
                title: article?.title,
                url: location.search,
              })
            }
          />
        </div>
      </footer>
      {article?.thumbnail ? (
        <img src={article?.thumbnail} alt='Thumbnail' />
      ) : (
        <div />
      )}
    </div>
  );
}
