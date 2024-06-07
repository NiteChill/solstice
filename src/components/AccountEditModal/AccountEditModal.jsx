import { useEffect, useState } from 'react';
import styles from './AccountEditModal.module.scss';
import Button from '../Button/Button';
import axios from 'axios';
import IconButton from '../IconButton/IconButton';

export default function AccountEditModal({
  isOpen,
  setIsOpen,
  setIsOpenDelete,
  user,
  setUser,
  setLoading,
  appWidth,
}) {
  const [modaleState, setModaleState] = useState(false),
    [editedUser, setEditUser] = useState({
      first_name: '',
      last_name: '',
      username: '',
      age: '',
    }),
    handleSave = async () => {
      if (
        !editedUser.first_name ||
        !editedUser.last_name ||
        !editedUser.username
      )
        return;
      setLoading(true);
      setIsOpen(false);
      (async () => {
        const response = await axios.post(
          'http://localhost:3000/api/update_account_data',
          { ...editedUser },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        if (response?.error) return console.log(response.error);
        if (response?.state === 'failed') return setLoading(false);
        setLoading(false);
        console.log(editedUser);
        setUser({ ...editedUser });
        setIsOpen(false);
      })();
    },
    inputControler = (e) => {
      setEditUser({ ...editedUser, [e.target.name]: e.target.value });
    };
  useEffect(() => console.log(editedUser), [editedUser]);
  useEffect(() => {
    setEditUser(user);
    isOpen
      ? setModaleState(true)
      : appWidth > 500
      ? setTimeout(() => setModaleState(false), 300)
      : setModaleState(false);
  }, [isOpen]);
  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.is_open : undefined}`}
      style={{
        height: modaleState ? '100dvh' : '0',
        width: modaleState ? '100vw' : '0',
      }}
    >
      <div
        className={styles.backdrop}
        onClick={() => setIsOpen(false)}
      ></div>
      <div className={styles.container}>
        <nav>
          <IconButton
            icon={appWidth < 500 ? 'arrow_back' : 'close'}
            onClick={() => setIsOpen(false)}
          />
          <h1 className='title-large'>Edit account</h1>
          <Button
            style='text'
            label='Save'
            onClick={handleSave}
            disabled={
              !editedUser?.first_name ||
              !editedUser?.last_name ||
              !editedUser?.username
            }
          />
        </nav>
        <main>
          {editedUser.profile_picture && (
            <header>
              <img
                src={editedUser.profile_picture}
                alt='profile_picture'
              />
            </header>
          )}
          <section>
            <span className='material-symbols-outlined'>person</span>
            <div>
              <input
                type='text'
                className='body-large'
                placeholder='First name'
                name='first_name'
                value={editedUser?.first_name}
                onInput={inputControler}
              />
              <input
                type='text'
                className='body-large'
                placeholder='Last name'
                name='last_name'
                value={editedUser?.last_name}
                onInput={inputControler}
              />
              <input
                type='text'
                className='body-large'
                placeholder='Username'
                name='username'
                value={editedUser?.username}
                onInput={inputControler}
              />
            </div>
          </section>
          <section>
            <span className='material-symbols-outlined'>cake</span>
            <div>
              <input
                type='number'
                className='body-large'
                placeholder='Age'
                name='age'
                value={editedUser?.age}
                onInput={inputControler}
              />
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
