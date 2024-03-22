import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import defaultAvatar from '../../assets/img/default_avatar.png';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ loggedIn = false, location, avatar = defaultAvatar }) {
  const navigate = useNavigate();
  return (
    <div className={styles.navbar}>
      {!loggedIn && location === '/' && (
        <div className={styles.logo}>
          <div></div>
        </div>
      )}
      {(loggedIn || location === '/login') && (
        <IconButton
          icon={location === '/' ? 'menu' : 'arrow_back'}
          overridePadding
          highContrast
          onClick={() => navigate('/')}
        />
      )}
      <h1 className='title-large'>
        {location === '/' ? 'Solstice' : 'Log in'}
      </h1>
      {loggedIn && <IconButton icon='add' style='filled_small' />}
      {location !== '/login' && <IconButton icon='search' />}
      {loggedIn && <IconButton avatar={avatar} />}
      {!loggedIn && location !== '/login' && (
        <div className={styles.button}>
          <Button label='Log in' onClick={() => navigate('/login')} />
        </div>
      )}
    </div>
  );
}
