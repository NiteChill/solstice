import axios from 'axios';
import styles from './article.module.scss';
import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Editor from '../../components/Editor/Editor';
import FAB from '../../components/FAB/FAB';
import FormatButton from '../../components/FormatButton/FormatButton';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

export default function Article() {
  const { link } = useParams(),
    [user, setUser, edit, setEdit, article, setArticle] = useOutletContext(),
    navigate = useNavigate(),
    editor = useEditor({
      extensions: [
        Link,
        Underline,
        Image.configure({
          allowBase64: true,
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
          },
        }),
      ],
      content: article?.content,
      editable: edit,
    });
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
        {/* <input
        type='file'
        className={`${styles.img} material-symbols-outlined`}
        accept='image/*'
        icon={body?.img ? 'edit' : 'add_photo_alternate'}
        name='img'
        onChange={(input) => {
          const file = input.target.files[0],
            reader = new FileReader();
          file && reader.readAsDataURL(file);
          reader.addEventListener('load', (e) => {
            input.target.style.background = `url(${e.target.result}) no-repeat center/cover`;
            setBody({ ...body, [input.target.name]: e.target.result });
          });
        }}
      /> */}
        <Editor editor={editor} edit={edit} />
        {user && article.authorId === user?.id && !edit && (
          <div className={styles.FAB}>
            <FAB icon='edit' onClick={() => setEdit(true)} />
          </div>
        )}
      </div>
      {user && article.authorId === user?.id && edit && (
        <div className={styles.toolbar}>
          <FormatButton
            icon='format_bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          />
          <FormatButton
            icon='format_italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          />
          <FormatButton
            icon='format_underlined'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
          />
          <FormatButton
            icon='format_strikethrough'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
          />
          <FormatButton icon='format_color_text' />
          <div className={styles.divider}></div>
          <FormatButton
            icon='format_list_bulleted'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          />
          <div className={styles.divider}></div>
          <div
            className={styles.dropdown}
            tabIndex={-1}
            onClick={(e) => e.target.focus()}
          >
            <FormatButton
              icon={
                editor.isActive('heading', { level: 1 })
                  ? 'format_h1'
                  : editor.isActive('heading', { level: 2 })
                  ? 'format_h2'
                  : editor.isActive('heading', { level: 3 })
                  ? 'format_h3'
                  : editor.isActive('heading', { level: 4 })
                  ? 'format_h4'
                  : editor.isActive('heading', { level: 5 })
                  ? 'format_h5'
                  : editor.isActive('heading', { level: 6 })
                  ? 'format_h6'
                  : 'format_paragraph'
              }
              dropDown
            />
            <div className={styles.menu}>
              <FormatButton
                icon='format_paragraph'
                onClick={() =>
                  editor.isActive('heading', { level: 1 })
                    ? editor.chain().focus().toggleHeading({ level: 1 }).run()
                    : editor.isActive('heading', { level: 2 })
                    ? editor.chain().focus().toggleHeading({ level: 2 }).run()
                    : editor.isActive('heading', { level: 3 })
                    ? editor.chain().focus().toggleHeading({ level: 3 }).run()
                    : editor.isActive('heading', { level: 4 })
                    ? editor.chain().focus().toggleHeading({ level: 4 }).run()
                    : editor.isActive('heading', { level: 5 })
                    ? editor.chain().focus().toggleHeading({ level: 5 }).run()
                    : editor.isActive('heading', { level: 6 }) &&
                      editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                active={!editor.isActive('heading')}
              />
              <FormatButton
                icon='format_h1'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                active={editor.isActive('heading', { level: 1 })}
              />
              <FormatButton
                icon='format_h2'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editor.isActive('heading', { level: 2 })}
              />
              <FormatButton
                icon='format_h3'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editor.isActive('heading', { level: 3 })}
              />
              <FormatButton
                icon='format_h4'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                active={editor.isActive('heading', { level: 4 })}
              />
              <FormatButton
                icon='format_h5'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                active={editor.isActive('heading', { level: 5 })}
              />
              <FormatButton
                icon='format_h6'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                active={editor.isActive('heading', { level: 6 })}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}