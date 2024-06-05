import { useNavigate, useParams } from 'react-router-dom';
import styles from './NavigationMenu.module.scss';
import IconButton from '../IconButton/IconButton';

export default function NavigationMenu({ location, isOpen, theme, setTheme, user }) {
  const navigate = useNavigate(),
    { link } = useParams();
  return (
    <nav className={`${isOpen ? styles.open : undefined} ${styles.navigation_menu}`}>
      <Segment
        icon='explore'
        label='Explore'
        active={location === '/'}
        onClick={() => navigate('/')}
      />
      <Segment
        icon='search'
        label='Search'
        active={location === '/search'}
        onClick={() => navigate('/search')}
      />
      {user && <Segment
        icon='person'
        label='Account'
        active={location.slice(0, 8) === '/account' && link === user?.id}
        onClick={() => navigate(`/account/${user?.id}`)}
      />}
      <div className={styles.container}>
        <IconButton
          icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
          onClick={() =>
            theme === 'light' ? setTheme('dark') : setTheme('light')
          }
        />
      </div>
    </nav>
  );
}

function Segment({ icon = 'settings', label, active = false, onClick }) {
  return (
    <div
      className={`${styles.segment} ${active ? styles.active : undefined}`}
      onClick={onClick}
    >
      <div>
        <span></span>
        <div>
          <span className='material-symbols-outlined'>{icon}</span>
        </div>
      </div>
      {label && <p className='label-medium-prominent'>{label}</p>}
    </div>
  );
}
