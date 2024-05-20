import { useNavigate } from 'react-router-dom';
import styles from './NavigationMenu.module.scss';

export default function NavigationMenu({ location }) {
  const navigate = useNavigate();
  return (
    <nav>
      <Segment
        icon='explore'
        // label='explore'
        active={location === '/'}
        onClick={() => navigate('/')}
      />
      <Segment
        icon='search'
        // label='Search'
        active={location === '/search'}
      />
      <Segment
        icon='person'
        // label='My library'
        active={location === '/account'}
        onClick={() => navigate('/account')}
      />
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
