import styles from './FormatButton.module.scss';

export default function FormatButton({ active = false, icon = 'settings', onClick, dropDown = false }) {
  return (
    <div className={`${styles.format_button} ${active && styles.active}`} onClick={onClick}>
      <div style={{paddingRight: dropDown && '0.375rem'}}>
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