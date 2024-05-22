import { useEffect, useState } from 'react';
import styles from './explore.module.scss';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Chip from '../../components/Chip/Chip';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';

export default function Explore() {
  const [selectedTags, setSelectedTags] = useState([]),
    [
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
      isOpenCreateSidesheet
    ] = useOutletContext(),
    [sortTags, setSortTags] = useState(tags),
    [articles, setArticles] = useState([]);
  useEffect(() => {
    console.log(selectedTags);
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
    let unselected = [],
      selected = [];
    tags.forEach((tag) => {
      selectedTags?.includes(tag.label)
        ? (selected = [...selected, tag])
        : (unselected = [...unselected, tag]);
    });
    setSortTags([...selected, ...unselected]);
  }, [selectedTags]);
  return (
    <div className={styles.explore}>
      <main>
        <div className={styles.title}>
          {user ? (
            <div>
              <h1
                className='display-medium'
                style={{ lineHeight: '3.5rem' }}
              >{`Hi ${user.username},`}</h1>
              <h2 className='display-medium'>
                What do you want to read today?
              </h2>
            </div>
          ) : (
            <div>
              <h1 className='display-medium'>Welcome to Solstice!</h1>
              <h2 className='display-medium'>Where stories come alive.</h2>
            </div>
          )}
        </div>
        <div className={styles.tags}>
          <div>
            {sortTags.map((tag) => (
              <Chip
                key={tag.label}
                icon={tag.icon}
                label={tag.label}
                low
                active={selectedTags?.includes(tag.label)}
                onClick={() => {
                  const newTags = selectedTags?.includes(tag.label)
                    ? selectedTags?.filter((el) => el !== tag.label)
                    : [...selectedTags, tag.label];
                  setSelectedTags(newTags);
                }}
              />
            ))}
          </div>
        </div>
        <div className={`${styles.articles} ${isOpenCreateSidesheet ? styles.open : ''}`}>
          {articles?.map((article) => (
            <ArticlePreview key={article.title} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}
