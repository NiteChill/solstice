import axios from 'axios';
import styles from './article.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import FAB from '../../components/FAB/FAB';
import { EditorContent } from '@tiptap/react';
import Toolbar from '../../components/Toolbar/Toolbar';
import LinkModal from '../../components/LinkModal/LinkModal';
import ImageModal from '../../components/ImageModal/ImageModal';
import ArticleHeader from '../../components/ArticleHeader/ArticleHeader';

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
      appWidth,
      isOpenLink,
      setIsOpenLink,
      isOpenImage,
      setIsOpenImage,
      loading,
      setLoading,
    ] = useOutletContext(),
    navigate = useNavigate();
  useEffect(() => {
    const getSingleArticle = async () => {
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
      };
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
        <ArticleHeader name={user.username} date={article.createdAt} />
        <EditorContent
          editor={editor}
          style={{ width: 'clamp(0px, 100%, 800px)' }}
          className={!editor?.isEditable ? styles.editable : undefined}
        />
        {user && article.authorId === user?.id && !edit && (
          <div className={styles.FAB}>
            <FAB icon='edit' onClick={() => setEdit(true)} />
          </div>
        )}
      </div>
      {appWidth < 500 && user && article.authorId === user?.id && edit && (
        <Toolbar editor={editor} />
      )}
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
