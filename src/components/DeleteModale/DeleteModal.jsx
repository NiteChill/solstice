import { useEffect, useState } from 'react';
import styles from './DeleteModal.module.scss';
import Button from '../Button/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteModal({
  isOpen,
  setIsOpen,
  article,
  setLoading,
  setIsOpenCreateSidesheet,
  user,
}) {
  const [modaleState, setModaleState] = useState(false),
    navigate = useNavigate(),
    handleDelete = () => {
      setLoading(true);
      setIsOpen(false);
      setIsOpenCreateSidesheet(false);
      if (article.authorId !== user.id) {
        setLoading(false);
        console.log('hihi');
        return;
      }
      (async () => {
        const response = await axios.post(
          'http://localhost:3000/api/delete_article',
          { id: article._id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response.error) return;
        setLoading(false);
        navigate('/');
      })();
    };
  useEffect(() => {
    isOpen
      ? setModaleState(true)
      : setTimeout(() => setModaleState(false), 300);
  }, [isOpen]);
  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.is_open : undefined}`}
      style={{
        height: modaleState ? '100dvh' : '0',
        width: modaleState ? '100vw' : '0',
      }}
    >
      <div className={styles.backdrop} onClick={() => setIsOpen(false)}></div>
      <div className={styles.container}>
        <h1 className='headline-small'>Permanently delete?</h1>
        <p className='body-medium'>
          This article will be permanently removed from your account and all
          databases.
        </p>
        <div className={styles.container_button}>
          <Button
            style='text-error'
            label='Cancel'
            onClick={() => setIsOpen(false)}
          />
          <Button style='text-error' label='Delete' onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
}
