import styles from './FormatButton.module.scss';

export default function FormatButton({ active = false, icon = 'settings', onClick, dropDown = false, disabled = false }) {
  return (
    <div
      className={`${styles.format_button} ${active && styles.active} ${disabled && styles.disabled}`}
      onClick={onClick}
    >
      <div>
        <span className='material-symbols-outlined'>{icon}</span>
        {dropDown && (
          <div className={styles.override_size} color='#FFF'>
            <span className='material-symbols-outlined'>arrow_drop_down</span>
          </div>
        )}
      </div>
    </div>
  );
}