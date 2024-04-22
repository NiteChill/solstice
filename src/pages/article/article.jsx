import axios from 'axios';
import styles from './article.module.scss';
import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import FAB from '../../components/FAB/FAB';
import FormatButton from '../../components/FormatButton/FormatButton';
import { EditorContent } from '@tiptap/react';
import ColorButton from '../../components/ColorButton/ColorButton';
import Toolbar from '../../components/Toolbar/Toolbar';

export default function Article() {
  const { link } = useParams(),
    [user, setUser, edit, setEdit, article, setArticle, editor, appWidth] =
      useOutletContext(),
    navigate = useNavigate();
  useEffect(() => {
    const getSingleArticle = async () => {
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
      else if (response.data?.article) setArticle(response.data.article);
    };
    getSingleArticle();
  }, []);

  useEffect(() => {
    editor?.commands.setContent(article?.content);
  }, [editor, article]);

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
        <EditorContent
          editor={editor}
          style={{ width: 'clamp(0px, 100%, 640px)' }}
        />
        {user && article.authorId === user?.id && !edit && (
          <div className={styles.FAB}>
            <FAB icon='edit' onClick={() => setEdit(true)} />
          </div>
        )}
      </div>
      {appWidth < 500 && user && article.authorId === user?.id && edit && (
        <Toolbar editor={editor}/>
      )}
    </>
  );
}
