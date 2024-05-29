import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toolbar from '../Toolbar/Toolbar';
import LinearProgressIndicator from '../LinearProgressIndicator/LinearProgressIndicator';

export default function Navbar({
  loggedIn = false,
  location,
  avatar = 'none',
  edit,
  setEdit,
  title,
  editor,
  article,
  user,
  setIsOpenLink,
  setIsOpenImage,
  loading,
  setLoading,
  isOpenCreateSidesheet,
  setIsOpenCreateSidesheet,
  appWidth,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
}) {
  const navigate = useNavigate(),
    handleSubmit = async () => {
      setEdit(false);
      setLoading(true);
      if (article?.authorId === user?.id) {
        const response = await axios.post(
          'http://localhost:3000/api/update_article',
          { id: article._id, content: editor.getHTML() },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.data.state === 'ok') {
          setLoading(false);
        } else return; // setLoading(false);
      }
    };
  return (
    <>
      <div
        className={`${styles.navbar} ${
          edit && !loading ? styles.edit_navbar : undefined
        }`}
      >
        <div className={styles.main}>
          {location.slice(0, 8) === '/article' && edit && (
            <IconButton
              style='standard_primary'
              icon='done'
              highContrast
              onClick={() => !loading && handleSubmit()}
            />
          )}
          {location !== '/search' && (
            <div className={styles.navbar_title}>
              <h1
                className='title-large'
                onClick={() => {
                  !(
                    location.slice(0, 8) === '/article' &&
                    edit &&
                    appWidth > 500
                  ) && navigate('/');
                }}
              >
                {location.slice(0, 8) === '/article' && edit
                  ? appWidth > 500 && title
                  : 'Solstice'}
              </h1>
            </div>
          )}
          {location.slice(0, 8) === '/article' && (
            <>
              {appWidth < 500 && edit && (
                <>
                  <IconButton
                    icon='undo'
                    onClick={() => editor?.commands.undo()}
                    disabled={!editor?.can().undo()}
                  />
                  <IconButton
                    icon='redo'
                    onClick={() => editor?.commands.redo()}
                    disabled={!editor?.can().redo()}
                  />
                </>
              )}
              {appWidth < 700 && edit && (
                <div
                  className={styles.dropdown}
                  onClick={(e) => {
                    if (e.currentTarget === document.activeElement)
                      e.currentTarget.removeAttribute('tabindex');
                    else {
                      e.currentTarget.setAttribute('tabindex', -1);
                      e.currentTarget.focus();
                    }
                  }}
                  onBlur={(e) => e.currentTarget.removeAttribute('tabindex')}
                >
                  <IconButton icon='add' />
                  <div className={styles.menu}>
                    <div
                      onClick={() => editor.commands.toggleCodeBlock().run()}
                      className={
                        editor?.isActive('codeBlock')
                          ? styles.active
                          : undefined
                      }
                    >
                      <span className='material-symbols-outlined'>code</span>
                      <p className='body-large'>Code block</p>
                    </div>
                    <div
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                      className={
                        editor?.isActive('blockquote')
                          ? styles.active
                          : undefined
                      }
                    >
                      <span className='material-symbols-outlined'>
                        format_quote
                      </span>
                      <p className='body-large'>Blockquote</p>
                    </div>
                    <div onClick={() => setIsOpenImage(true)}>
                      <span className='material-symbols-outlined'>image</span>
                      <p className='body-large'>Image</p>
                    </div>
                    <div onClick={() => setIsOpenLink(true)}>
                      <span className='material-symbols-outlined'>link</span>
                      <p className='body-large'>Link</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {appWidth < 720 && !edit && location !== '/search' && (
            <IconButton
              icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
              onClick={() =>
                theme === 'light' ? setTheme('dark') : setTheme('light')
              }
            />
          )}
          {user &&
            !isOpenCreateSidesheet &&
            !edit &&
            location.slice(0, 8) !== '/article' &&
            location !== '/search' && (
              <IconButton
                icon='add'
                onClick={async () => setIsOpenCreateSidesheet(true)}
              />
            )}
          {user &&
            user?.id === article?.authorId &&
            location.slice(0, 8) === '/article' &&
            !isOpenCreateSidesheet &&
            !edit && (
              <IconButton
                icon='settings'
                onClick={async () => setIsOpenCreateSidesheet(true)}
              />
            )}
          {!user &&
            location !== '/login' &&
            location !== '/sign_up' &&
            location !== '/search' && (
              <div className={styles.button}>
                <Button label='Log in' onClick={() => navigate('/login')} />
              </div>
            )}
          {location === '/search' && (
            <>
              <input
                type='text'
                placeholder='Search'
                className={`${styles.search_field} title-large`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                autoFocus
              />
              <IconButton icon='close' onClick={() => setSearchQuery('')} />
            </>
          )}
        </div>
        {appWidth > 500 &&
          user &&
          article?.authorId === user?.id &&
          edit &&
          !loading && (
            <Toolbar
              editor={editor}
              setIsOpenLink={setIsOpenLink}
              setIsOpenImage={setIsOpenImage}
            />
          )}
        {loading && <LinearProgressIndicator />}
      </div>
    </>
  );
}
