import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import defaultAvatar from '../../assets/img/default_avatar.png';

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <IconButton icon='menu' overridePadding highContrast />
      <h1 className='title-large'>Solstice</h1>
      <IconButton icon='add' style='filled_small' />
      <IconButton icon='search' />
      <IconButton avatar={defaultAvatar} />
    </div>
  );
}