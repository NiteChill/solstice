import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({
  loggedIn = false,
  location,
  avatar = 'none',
  edit,
  setEdit,
  title,
}) {
  const navigate = useNavigate(),
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
      {location === '/' && loggedIn && (
        <>
          <IconButton icon='menu' overridePadding highContrast />
          <h1 className='title-large'>Solstice</h1>
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
          <IconButton icon='search' />
          <IconButton
            avatar={avatar !== 'none' && avatar}
            icon={avatar === 'none' && 'person'}
            style={avatar === 'none' && 'filled_small_primary'}
          />
        </>
      )}

      {location === '/' && !loggedIn && (
        <>
          <div className={styles.logo}>
            <div></div>
          </div>
          <h1 className='title-large'>Solstice</h1>
          <div className={styles.button}>
            <Button label='Log in' onClick={() => navigate('/login')} />
          </div>
        </>
      )}

      {(location === '/login' || location === '/sign_up') && (
        <>
          <IconButton
            icon='arrow_back'
            overridePadding
            highContrast
            onClick={() => navigate(-1)}
          />
          <h1 className='title-large'>
            {location === '/login' ? 'Log in' : 'Sign up'}
          </h1>
        </>
      )}

      {location.slice(0, 8) === '/article' && edit && (
        <>
          <IconButton
            style='standard_primary'
            icon='done'
            overridePadding
            highContrast
            onClick={() => setEdit(false)}
          />
          <h1 className='title-large'>{title}</h1>
          <IconButton icon='match_case' />
          <IconButton icon='add' />
          <IconButton icon='more_vert' />
        </>
      )}

      {location.slice(0, 8) === '/article' && !edit && (
        <>
          <IconButton
            icon='arrow_back'
            overridePadding
            highContrast
            onClick={() => navigate(-1)}
          />
          <h1 className='title-large'>{title}</h1>
          {/* <IconButton icon='favorite' /> */}
          {/* <IconButton icon='share' /> */}
          <IconButton icon='message' />
          <IconButton icon='more_vert' />
        </>
      )}
    </div>
  );
}
