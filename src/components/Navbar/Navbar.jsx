import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import Button from '../Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({
  loggedIn = false,
  location,
  avatar = 'none',
  edit,
  setEdit
}) {
  const navigate = useNavigate(),
    { link } = useParams(),
    handleCreate = async () => {
      const response = await axios.get(
        'http://localhost:3000/api/create_article',
        {
          withCredentials: true,
        }
      );
      if (response.data.state === 'ok') return response.data.id;
      else return false;
    };
  return (
    <div className={styles.navbar}>
      {!loggedIn && location === '/' && (
        <div className={styles.logo}>
          <div></div>
        </div>
      )}
      {(loggedIn || location === '/login' || location === '/sign_up') && (
        <IconButton
          style={edit && 'standard_primary'}
          icon={location === '/' ? 'menu' : edit ? 'done' : 'arrow_back'}
          overridePadding
          highContrast
          onClick={() =>
            location === '/login' || location === '/sign_up'
              ? navigate(-1)
              : edit && console.log('create')
          }
        />
      )}
      <h1 className='title-large'>
        {location === '/'
          ? 'Solstice'
          : location === '/login'
          ? 'Log in'
          : location === '/sign_up'
          ? 'Sign up'
          : link && link}
      </h1>
      {loggedIn && edit && <IconButton icon='match_case' />}
      {loggedIn && (
        <IconButton
          icon='add'
          onClick={async () => {
            const id = await handleCreate();
            if (id) {
              navigate(`/article/${id}`);
              setEdit(true);
            }
          }}
        />
      )}
      {location !== '/login' && location !== '/sign_up' && (
        <IconButton icon={edit ? 'more_vert' : 'search'} />
      )}
      {loggedIn && !edit && (
        <IconButton
          avatar={avatar !== 'none' && avatar}
          icon={avatar === 'none' && 'person'}
          style={avatar === 'none' && 'filled_small_primary'}
        />
      )}
      {!loggedIn && location !== '/login' && location !== '/sign_up' && (
        <div className={styles.button}>
          <Button label='Log in' onClick={() => navigate('/login')} />
        </div>
      )}
    </div>
  );
}
