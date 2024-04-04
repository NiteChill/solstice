import styles from './article.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

export default function Article() {
  const { link } = useParams(),
    [user, setUser, edit, setEdit] = useOutletContext(),
    [body, setBody] = useState([]),
    navigate = useNavigate();
  useEffect(() => {
    link === 'new' && setEdit(true);
  }, []);
  useEffect(() => {
    !user && edit && navigate('/');
  }, [user]);
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
            console.log(e.target.result);
          });
        }}
      />
    </div>
  );
}
