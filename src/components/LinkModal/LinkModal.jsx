import { useEffect, useState } from 'react';
import styles from './LinkModal.module.scss';
import Button from '../Button/Button';

export default function LinkModal({ isOpen, setIsOpen }) {
  const [modaleState, setModaleState] = useState(false);
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
        <h1 className='headline-small'>Create a link</h1>
        <div className={styles.content}>
          <input type='url' className='body-large' placeholder='Your link' />
        </div>
        <div className={styles.container_button}>
          <Button style='text' label='Cancel' />
          <Button style='text' label='Create' />
        </div>
      </div>
    </div>
  );
}
