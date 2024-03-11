import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <IconButton icon='menu' overridePadding highContrast />
      <h1 className='nav-text'>Solstice</h1>
      <IconButton icon='add' style='filled_small' />
      <IconButton icon='search' />
    </div>
  );
}