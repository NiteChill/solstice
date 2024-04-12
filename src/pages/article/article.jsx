import axios from 'axios';
import styles from './article.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';

export default function Article() {
  const { link } = useParams(),
    [user, setUser, edit, setEdit] = useOutletContext(),
    [body, setBody] = useState([]),
    [article, setArticle] = useState(null),
    navigate = useNavigate(),
    extensions = [
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
    content = `
    <h2>
      Hi there,
    </h2>
    <p>
      this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
    <pre><code class="language-css">body {
    display: none;
    }</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
    `;
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
      console.log(article);
    };
    getSingleArticle();
  }, []);
  useEffect(() => {
    !user && edit && navigate('/');
  }, [user, edit]);
  return (
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
      <EditorProvider extensions={extensions} content={content} />
    </div>
  );
}
