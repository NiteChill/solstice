import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from './editor.module.scss';
import { useEffect } from 'react';

export default function Editor() {
  const navigate = useNavigate(),
    [user, setUser] = useOutletContext();
  useEffect(() => {
    !user && navigate('/');
  }, [user]);
  return <div className={styles.editor}></div>;
}
