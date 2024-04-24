import { useEffect, useState } from 'react';
import styles from './LinkModal.module.scss';

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
      <div className={styles.container}></div>
    </div>
  );
}
