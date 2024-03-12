import styles from './Button.module.scss';

export default function Button({label = 'Label'}) {
  return (
    <div className={styles.button}>
      <div>
        <p className='label-large'>{label}</p>
      </div>
    </div>
  );
}