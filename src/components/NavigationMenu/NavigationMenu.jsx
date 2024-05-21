import { useNavigate } from 'react-router-dom';
import styles from './NavigationMenu.module.scss';
import IconButton from '../IconButton/IconButton';

export default function NavigationMenu({ location, isOpen, theme, setTheme }) {
  const navigate = useNavigate();
  return (
    <nav className={isOpen ? styles.open : undefined}>
      <Segment
        icon='explore'
        label='Explore'
        active={location === '/'}
        onClick={() => navigate('/')}
      />
      <Segment icon='search' label='Search' active={location === '/search'} />
      <Segment
        icon='person'
        label='Account'
        active={location === '/account'}
        onClick={() => navigate('/account')}
      />
      <div className={styles.container}>
        <IconButton
          icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
          onClick={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
        />
      </div>
    </nav>
  );
}

function Segment({ icon = 'settings', label, active = false, onClick }) {
  return (
    <div className={`${styles.segment} ${active ? styles.active : undefined}`} onClick={onClick}>
      <div>
        <div>
          <span className='material-symbols-outlined'>{icon}</span>
        </div>
      </div>
      {label && <p className='label-medium-prominent'>{label}</p>}
    </div>
  );
}