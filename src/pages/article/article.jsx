import axios from 'axios';
import styles from './article.module.scss';
import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import FAB from '../../components/FAB/FAB';
import { EditorContent } from '@tiptap/react';
import Toolbar from '../../components/Toolbar/Toolbar';
import LinkModal from '../../components/LinkModal/LinkModal';
import ImageModal from '../../components/ImageModal/ImageModal';
import ArticleHeader from '../../components/ArticleHeader/ArticleHeader';
import Snackbar from '../../components/Snackbar/Snackbar';

export default function Article() {
  const { link } = useParams(),
    [
      user,
      setUser,
      edit,
      setEdit,
      article,
      setArticle,
      editor,
      isOpenLink,
      setIsOpenLink,
      isOpenImage,
      setIsOpenImage,
      loading,
      setLoading,
      appWidth,
      isOpenMenu,
    ] = useOutletContext(),
    location = useLocation(),
    navigate = useNavigate(),
    [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  useEffect(() => {
    (async function getSingleArticle() {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/get_single_article',
        { id: link },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data?.error) navigate('/');
      else if (response.data?.article) {
        setArticle(response.data.article);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    editor?.commands.setContent(article?.content);
  }, [editor, article?.content]);

  useEffect(() => {
    editor?.setOptions({ editable: edit });
    edit && editor?.commands.focus();
  }, [editor, edit]);

  useEffect(() => {
    !user && edit && navigate('/');
  }, [user, edit]);
  return (
    <>
      <div className={styles.article}>
        {!loading && (
          <ArticleHeader
            name={article?.author}
            date={article?.createdAt}
            likes={article?.likes?.length}
            liked={article?.likes?.includes(user?.id)}
            id={user?.id}
            article={article}
            setArticle={setArticle}
            noAccountAction={() => setIsOpenSnackbar(true)}
            location={location}
          />
        )}
        <EditorContent
          editor={editor}
          style={{ width: 'clamp(0px, 100%, 45rem)' }}
          className={!editor?.isEditable ? styles.editable : undefined}
        />
        {user && article?.authorId === user?.id && !edit && (
          <div
            className={styles.FAB}
            style={{
              bottom: isOpenMenu && appWidth < 720 && '5.25rem',
            }}
          >
            <FAB icon='edit' onClick={() => setEdit(true)} />
          </div>
        )}
      </div>
      {appWidth < 500 && user && article?.authorId === user?.id && edit && (
        <Toolbar editor={editor} />
      )}
      <Snackbar
        label='Account required'
        action='Log in'
        onClick={() => navigate('/login')}
        isOpen={isOpenSnackbar}
        setIsOpen={setIsOpenSnackbar}
      />
      <LinkModal
        isOpen={isOpenLink}
        setIsOpen={setIsOpenLink}
        editor={editor}
      />
      <ImageModal
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
        editor={editor}
      />
    </>
  );
}
