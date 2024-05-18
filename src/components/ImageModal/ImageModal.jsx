import { useEffect, useState } from 'react';
import styles from './ImageModal.module.scss';
import Button from '../Button/Button';
import validator from 'validator';
import Chip from '../Chip/Chip';

export default function ImageModal({ isOpen, setIsOpen, editor }) {
  const [modaleState, setModaleState] = useState(false),
    [content, setContent] = useState(''),
    [error, setError] = useState(false),
    [mode, setMode] = useState(0),
    [file, setFile] = useState(null),
    handleSubmit = (e) => {
      if (mode) {
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        });
        reader.readAsDataURL(file);
        setIsOpen(false);
        return;
      }
      if (!validator.isURL(content)) {
        setError('Please select a valid url');
        return;
      }
      editor.chain().focus().setImage({ src: content }).run();
      setIsOpen(false);
    };
  useEffect(() => {
    isOpen
      ? setModaleState(true)
      : setTimeout(() => setModaleState(false), 300);
    setContent('');
    setFile(null);
    setError(false);
  }, [isOpen]);
  useEffect(() => {
    setContent('');
    setFile(null);
  }, [mode]);
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
        <h1 className='headline-small'>Insert image</h1>
        <div className={styles.container_chips}>
          <Chip label='URL' active={!mode && true} onClick={() => setMode(0)} overrideDone />
          <Chip
            label='My files'
            active={mode && true}
            onClick={() => {
              setContent('');
              setMode(1);
            }}
            overrideDone
          />
        </div>
        <div className={styles.content}>
          {mode ? (
            <>
              <label htmlFor='file' className='body-large'>
                {content ? content : 'Select your file'}
              </label>
              <input
                id='file'
                type='file'
                accept='image/*'
                value={content}
                onInput={(e) => {
                  setFile(e.target.files[0]);
                  setContent(e.target.value);
                }}
              />
            </>
          ) : (
            <input
              type='url'
              className='body-large'
              placeholder='Image URL'
              value={content}
              onInput={(e) => setContent(e.target.value)}
            />
          )}
          <div className={styles.supporting_text}>
            <p className='body-small'>{error}</p>
          </div>
        </div>
        <div className={styles.container_button}>
          <Button
            style='text'
            label='Cancel'
            onClick={() => setIsOpen(false)}
          />
          <Button
            style='text'
            label='Upload'
            disabled={content ? false : true}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
