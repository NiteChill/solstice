import { useEffect, useState } from 'react';
import styles from './Snackbar.module.scss';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';

export default function Snackbar({
  label,
  action,
  onClick,
  isOpen,
  setIsOpen,
}) {
  const [closed, setClosed] = useState(true);
  useEffect(() => {
    !isOpen ? setTimeout(() => setClosed(true), 300) : setClosed(false);
  }, [isOpen]);
  return (
    <div className={`${styles.snackbar} ${isOpen ? styles.open : undefined}`} style={{height: closed && 0, padding: closed && 0}}>
      <p className='body-large'>{label}</p>
      {action && onClick && (
        <Button style='text' label={action} onClick={onClick} />
      )}
      <IconButton icon='close' onClick={() => setIsOpen(false)} />
    </div>
  );
}
