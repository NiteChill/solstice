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
          {location === '/' && loggedIn && (
            <RootLoggedIn
              isOpenCreateSidesheet={isOpenCreateSidesheet}
              setIsOpenCreateSidesheet={setIsOpenCreateSidesheet}
            />
          )}

          {location === '/' && !loggedIn && <Root navigate={navigate} />}

          {(location === '/login' || location === '/sign_up') && (
            <LoginSignup navigate={navigate} location={location} />
          )}

          {location.slice(0, 8) === '/article' && edit && (
            <ArticleEdited
              handleSubmit={handleSubmit}
              loading={loading}
              editor={editor}
              title={title}
              appWidth={appWidth}
            />
          )}

          {location.slice(0, 8) === '/article' && !edit && (
            <Article
              article={article}
              user={user}
              setIsOpenCreateSidesheet={setIsOpenCreateSidesheet}
              loading={loading}
              loggedIn={loggedIn}
              navigate={navigate}
            />
          )}

          {location === '/account' && <Account />}
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

function SolsticeLink() {
  const navigate = useNavigate();
  return (
    <div className={styles.navbar_title}>
      <h1 className='title-large' onClick={() => navigate('/')}>
        Solstice
      </h1>
    </div>
  );
}

function RootLoggedIn({ isOpenCreateSidesheet, setIsOpenCreateSidesheet }) {
  return (
    <>
      <SolsticeLink />
      {!isOpenCreateSidesheet && (
        <IconButton
          icon='add'
          onClick={async () => setIsOpenCreateSidesheet(true)}
        />
      )}
    </>
  );
}

function Root({ navigate }) {
  return (
    <>
      <SolsticeLink />
      <div className={styles.button}>
        <Button label='Log in' onClick={() => navigate('/login')} />
      </div>
    </>
  );
}

function LoginSignup({ navigate, location }) {
  return (
    <>
      <IconButton icon='arrow_back' highContrast onClick={() => navigate(-1)} />
      <div className={styles.navbar_title} style={{ paddingLeft: 0 }}>
        <h1 className='title-large'>
          {location === '/login' ? 'Log in' : 'Sign up'}
        </h1>
      </div>
    </>
  );
}

function ArticleEdited({ handleSubmit, loading, editor, title, appWidth }) {
  return (
    <>
      <IconButton
        style='standard_primary'
        icon='done'
        highContrast
        onClick={() => !loading && handleSubmit()}
        // loading={loading}
      />
      <div className={styles.navbar_title} style={{ paddingLeft: 0 }}>
        <h1 className='title-large'>{appWidth > 500 && title}</h1>
      </div>
      {appWidth < 500 && (
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
      {appWidth < 650 && (
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
                editor?.isActive('codeBlock') ? styles.active : undefined
              }
            >
              <span className='material-symbols-outlined'>code</span>
              <p className='body-large'>Code block</p>
            </div>
            <div
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={
                editor?.isActive('blockquote') ? styles.active : undefined
              }
            >
              <span className='material-symbols-outlined'>format_quote</span>
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
      <IconButton icon='more_vert' />
    </>
  );
}

function Article({
  article,
  user,
  setIsOpenCreateSidesheet,
  loggedIn,
  navigate,
}) {
  return (
    <>
      <SolsticeLink />
      {article?.authorId === user?.id && (
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
          <IconButton icon='more_vert' />
          <div className={styles.menu}>
            <div onClick={() => setIsOpenCreateSidesheet(true)}>
              <span className='material-symbols-outlined'>edit</span>
              <p className='body-large'>Edit details</p>
            </div>
            <div onClick={() => ''}>
              <span
                className='material-symbols-outlined'
                style={{ color: 'var(--error)' }}
              >
                delete
              </span>
              <p className='body-large' style={{ color: 'var(--error)' }}>
                Delete article
              </p>
            </div>
          </div>
        </div>
      )}
      {!loggedIn && (
        <Button label='Log in' onClick={() => navigate('/login')} />
      )}
    </>
  );
}

function Account() {
  return <SolsticeLink />;
}
