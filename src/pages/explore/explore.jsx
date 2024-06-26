import { useEffect, useState } from 'react';
import styles from './explore.module.scss';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Chip from '../../components/Chip/Chip';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';
import Button from '../../components/Button/Button';

export default function Explore() {
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
      selectedTags,
      setSelectedTags,
    ] = useOutletContext(),
    [articles, setArticles] = useState([]);
  useEffect(() => {
    (async function getArticlesByCategories() {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/get_articles_by_category',
        { tags: selectedTags.length > 0 ? selectedTags : 'all' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) console.log(response.data.error);
      else if (response.data?.articles) {
        setLoading(false);
        setArticles(response.data.articles);
      }
    })();
  }, [selectedTags]);
  return (
    <div className={styles.explore}>
      <main>
        <div className={styles.title}>
          {user ? (
            <div>
              <h1
                className='display-large'
                style={{ lineHeight: '3.5rem' }}
              >{`Hi ${user.username},`}</h1>
              <h2 className='display-large'>What do you want to read today?</h2>
            </div>
          ) : (
            <div>
              <h1 className='display-large'>Welcome to Solstice!</h1>
              <h2 className='display-large'>Where stories come alive.</h2>
            </div>
          )}
        </div>
        <div className={styles.tags}>
          <div>
            <Button
              style={isOpenFilterSidesheet ? 'standard' : 'outlined_primary'}
              icon={isOpenFilterSidesheet ? 'close' : 'instant_mix'}
              label='Filters'
              onClick={() => setIsOpenFilterSidesheet(!isOpenFilterSidesheet)}
            />
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                close
                onClick={() => {
                  const newTags = selectedTags?.includes(tag)
                    ? selectedTags?.filter((el) => el !== tag)
                    : [...selectedTags, tag];
                  setSelectedTags(newTags);
                }}
              />
            ))}
          </div>
        </div>
        <div
          className={`${styles.articles} ${
            isOpenCreateSidesheet || isOpenFilterSidesheet ? styles.open : ''
          }`}
        >
          {articles?.map((article) => (
            <ArticlePreview key={article.title} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}
