import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import styles from './CreateSidesheet.module.scss';

export default function CreateSidesheet({ isOpen, setIsOpen }) {
  const [sidesheetState, setSidesheetState] = useState(isOpen);
  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
  }, [isOpen]);
  return (
    <>
      <div
        className={styles.backdrop}
        onClick={() => setIsOpen(false)}
        style={{ opacity: isOpen && 0.5, top: sidesheetState && 0 }}
      ></div>
      <div
        className={`${styles.container} ${isOpen ? styles.open : undefined}`}
        style={{ width: !sidesheetState && 0 }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>Create</h1>
            <IconButton icon='close' onClick={() => setIsOpen(false)} />
          </header>
          <main></main>
          <footer>
            <Button label='Create' />
            <Button
              label='Cancel'
              style='outlined_primary'
              onClick={() => setIsOpen(false)}
            />
          </footer>
        </div>
      </div>
    </>
  );
}
