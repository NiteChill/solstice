import { useEffect, useState } from 'react';
import styles from './discover.module.scss';
import { useOutletContext } from 'react-router-dom';

export default function Discover() {
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
    <div className={styles.discover}>
      <div>
        {user ? (
          <div>
            <h1 className='display-medium' style={{lineHeight: '3.5rem'}}>{`Hi ${user.username},`}</h1>
            <h2 className='display-medium'>What do you want to read today?</h2>
          </div>
        ) : (
          <div>
            <h1 className='display-medium'>Welcome to Solstice!</h1>
            <h2 className='display-medium'>Where stories come alive.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
