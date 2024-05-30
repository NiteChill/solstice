import { useOutletContext } from 'react-router-dom';
import styles from './search.module.scss';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Search() {
  const searchQuery = useOutletContext()[21],
    setSearchQuery = useOutletContext()[22],
    setLoading = useOutletContext()[12],
    [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (searchQuery.length <= 2) {
      setSearchResults([]);
      return;
    };
    const timeout = setTimeout(() => {
      (async () => {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:3000/api/search',
          { query: searchQuery },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data?.error) setLoading(false);
        else if (response.data?.articles) {
          setSearchResults(response.data.articles);
          setLoading(false);
        }
      })();
    },500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);
  return (
    <div className={styles.search}>
      <main>
        {searchResults.map((result) => (
          <ArticlePreview article={result} key={result._id} />
        ))}
      </main>
    </div>
  );
}
