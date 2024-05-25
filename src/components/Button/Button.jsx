import styles from './Button.module.scss';

export default function Button({
  style = 'standard',
  label = 'Label',
  icon = false,
  onClick,
  disabled = false
}) {
  return (
    <div
      className={`${styles.button} ${disabled ? styles.disabled : undefined} ${
        style === 'standard'
          ? styles.standard
          : style === 'outlined_primary'
          ? styles.outlined_primary
          : styles.text
      }`}
      onClick={onClick}
    >
      <div style={{ paddingLeft: icon && '0.75rem' }}>
        {icon && <span className='material-symbols-outlined'>{icon}</span>}
        <p className='label-large'>{label}</p>
      </div>
    </div>
  );
}
