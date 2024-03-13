import styles from './Button.module.scss';

export default function Button({style = 'standard', label = 'Label', onClick}) {
  return (
    <div className={`${styles.button} ${style === 'standard' ? styles.standard : styles.text}`} onClick={onClick}>
      <div>
        <p className='label-large'>{label}</p>
      </div>
    </div>
  );
}