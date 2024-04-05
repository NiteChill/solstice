import axios from 'axios';
import styles from './article.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

export default function Article() {
  const { link } = useParams(),
    [user, setUser, edit, setEdit] = useOutletContext(),
    [body, setBody] = useState([]),
    [article, setArticle] = useState(null),
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
      console.log(article);
    };
    getSingleArticle();
  }, []);
  useEffect(() => {
    !user && edit && navigate('/');
  }, [user, edit]);
  return (
    <div className={styles.article}>
      <input
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
      />
    </div>
  );
}
