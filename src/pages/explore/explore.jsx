import { useEffect, useState } from 'react';
import styles from './explore.module.scss';
import { useOutletContext } from 'react-router-dom';
import IconButton from '../../components/IconButton/IconButton';

export default function Explore() {
  const [user, setUser] = useOutletContext(),
  [category, setCategory] = useState('all'),
  [loading, setLoading] = useState(false);
  useEffect(() => {
    // (async function getArticles() {
    //   setLoading(true);
    //   const response = await axios.post(
    //     'http://localhost:3000/api/get_articles_by_category',
    //     { category: category },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       withCredentials: true,
    //     }
    //   );
    //   if (response.data?.error) console.log(response.data.error);
    //   else if (response.data?.articles) {
    //     setLoading(false);
    //   };
    // }());
  }, [])
  return (
    <div className={styles.explore}>
      <div className={styles.title}>
        {user ? (
          <div>
            <h1
              className='display-medium'
              style={{ lineHeight: '3.5rem' }}
            >{`Hi ${user.username},`}</h1>
            <h2 className='display-medium'>What do you want to read today?</h2>
          </div>
        ) : (
          <div>
            <h1 className='display-medium'>Welcome to Solstice!</h1>
            <h2 className='display-medium'>Where stories come alive.</h2>
          </div>
        )}
      </div>
      <a href='/article/66202b3d2f67ec58b8baa41c'>devlog</a>
    </div>
  );
}
