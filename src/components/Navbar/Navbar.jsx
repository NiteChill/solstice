import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import defaultAvatar from '../../assets/img/default_avatar.png';
import Button from '../Button/Button';

export default function Navbar({login = false}) {
  return (
    <div className={styles.navbar}>
      {!login && (
        <div className={styles.logo}>
          <div
            style={{ background: `url('./src/assets/img/logo.svg') no-repeat center/cover` }}
          ></div>
        </div>
      )}
      {login && <IconButton icon='menu' overridePadding highContrast />}
      <h1 className='title-large'>Solstice</h1>
      {login && <IconButton icon='add' style='filled_small' />}
      <IconButton icon='search' />
      {login && <IconButton avatar={defaultAvatar} />}
      {!login && <Button label='Sign in' />}
    </div>
  );
}