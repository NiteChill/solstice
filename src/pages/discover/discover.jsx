import styles from './discover.module.scss';
import { useOutletContext } from 'react-router-dom';

export default function Discover() {
  const [user, setUser] = useOutletContext();
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
