import styles from './FormatButton.module.scss';

export default function FormatButton({ active = false, icon = 'settings', onClick, dropDown = false, disabled = false }) {
  return (
    <div className={`${styles.format_button} ${active && styles.active}`} onClick={onClick} style={{opacity: disabled && '0.6'}}>
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