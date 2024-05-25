import IconButton from '../IconButton/IconButton';
import styles from './FilterSidesheet.module.scss';
import { useEffect, useState } from 'react';

export default function FilterSidesheet({isOpen, setIsOpen}) {
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
        style={{
          width:
            window.innerWidth < 900 &&
            (sidesheetState ? 'clamp(0px, 100%, 21.25rem)' : 0),
        }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>Filters</h1>
            <IconButton icon='close' onClick={() => setIsOpen(false)} />
          </header>
        </div>
      </div>
    </>
  );
}