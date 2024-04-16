import styles from './FAB.module.scss';

export default function FAB({ icon = settings, label = null, onClick }) {
  return (
    <div className={styles.FAB} onClick={onClick}>
      <div style={{ padding: !label && '1rem' }}>
        <span className='material-symbols-outlined'>{icon}</span>
        {label && <p className='label-large'>{label}</p>}
      </div>
    </div>
  );
}