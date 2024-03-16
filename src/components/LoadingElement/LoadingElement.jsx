import { useEffect, useState } from 'react';
import styles from './LoadingElement.module.scss';

export default function LoadingElement() {
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setDisplay(true);
    }, 200);
  }, []);
  return (
    <div className={styles.loading_element}>
      {display && (
        <>
          <div></div>
          <h1 className='display-medium'>Solstice</h1>
        </>
      )}
    </div>
  );
}
