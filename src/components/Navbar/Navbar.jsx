import IconButton from '../IconButton/IconButton';
import styles from './Navbar.module.scss';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toolbar from '../Toolbar/Toolbar';

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
  appWidth,
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
    },
    handleSubmit = async () => {
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
        if (response.data.state === 'ok') setEdit(false);
        //else //error
      }
    };
  // console.log(article);
  return (
    <div className={`${styles.navbar} ${edit && styles.edit_navbar}`}>
      <div className={styles.main}>
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
              onClick={() => handleSubmit()}
            />
            <h1 className='title-large'>{appWidth > 500 && title}</h1>
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
                    className={editor?.isActive('codeBlock') && styles.active}
                  >
                    <span className='material-symbols-outlined'>code</span>
                    <p className='body-large'>Code block</p>
                  </div>
                  <div
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor?.isActive('blockquote') && styles.active}
                  >
                    <span className='material-symbols-outlined'>
                      format_quote
                    </span>
                    <p className='body-large'>Blockquote</p>
                  </div>
                  <div>
                    <span className='material-symbols-outlined'>image</span>
                    <p className='body-large'>Image</p>
                  </div>
                  <div>
                    <span className='material-symbols-outlined'>link</span>
                    <p className='body-large'>Link</p>
                  </div>
                </div>
              </div>
            )}
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
      {appWidth > 500 && user && article.authorId === user?.id && edit && (
        <Toolbar editor={editor} />
      )}
    </div>
  );
}
