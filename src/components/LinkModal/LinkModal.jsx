import { useEffect, useState } from 'react';
import styles from './LinkModal.module.scss';
import Button from '../Button/Button';
import validator from 'validator';

export default function LinkModal({ isOpen, setIsOpen, editor }) {
  const [modaleState, setModaleState] = useState(false),
    [content, setContent] = useState(''),
    [error, setError] = useState(false),
    handleSubmit = () => {
      if (!validator.isURL(content)) {
        setError('Please select a valid url');
        return;
      }
      // editor?.commands.setLink({ href: content });
      editor.chain().focus().setLink({ href: content }).run();
      setIsOpen(false);
    }
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
          <input type='url' className='body-large' placeholder='Your link' value={content} onInput={(e) => setContent(e.target.value)} />
          <div className={styles.supporting_text}>
            <p className="body-small">{error}</p>
          </div>
        </div>
        <div className={styles.container_button}>
          <Button style='text' label='Cancel' onClick={() => setIsOpen(false)} />
          <Button style='text' label='Create' disabled={content ? false : true} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
