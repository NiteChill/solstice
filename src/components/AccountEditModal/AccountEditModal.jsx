import { useEffect, useState } from 'react';
import styles from './AccountEditModal.module.scss';
import Button from '../Button/Button';
import axios from 'axios';
import IconButton from '../IconButton/IconButton';
import defaultAvatar from '../../assets/img/default_avatar.png';

export default function AccountEditModal({ isOpen, setIsOpen, onSubmit, setIsOpenDelete }) {
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
        <nav>
          <IconButton icon='close' onClick={() => setIsOpen(false)} />
          <h1 className='title-large'>Edit account</h1>
          <Button style='text' label='Save' />
        </nav>
        <main>
          <header>
            <img src={defaultAvatar} alt='profile_picture' />
          </header>
          <section>
            <span className='material-symbols-outlined'>person</span>
            <div>
              <input
                type='text'
                className='body-large'
                placeholder='First name'
              />
              <input
                type='text'
                className='body-large'
                placeholder='Last name'
              />
              <input
                type='text'
                className='body-large'
                placeholder='Username'
              />
            </div>
          </section>
          <section>
            <span className='material-symbols-outlined'>cake</span>
            <div>
              <input type='number' className='body-large' placeholder='Age' />
            </div>
          </section>
          <Button
            style='text-error'
            icon='delete'
            label='Delete account'
            onClick={() => setIsOpenDelete('account')}
          />
        </main>
      </div>
    </div>
  );
}
