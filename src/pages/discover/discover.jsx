import styles from './discover.module.scss';
import { useOutletContext } from 'react-router-dom';

export default function Discover() {
  const [user, setUser] = useOutletContext();
  return (
    <div className={styles.discover}>
      {user ? (
        <div>
          <h1 className='display-medium'>{`Hi, ${user.first_name}.`}</h1>
          <h2 className='display-medium'>What do you want to read today?</h2>
        </div>
      ) : (
        <div>
          <h1 className='display-medium'>{`Welcome to Solstice!`}</h1>
          <h2 className='display-medium'>Where stories come alive.</h2>
        </div>
      )}
    </div>
  );
}
