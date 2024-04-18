import styles from './Button.module.scss';

export default function Button({
  style = 'standard',
  label = 'Label',
  icon = false,
  onClick,
}) {
  return (
    <div
      className={`${styles.button} ${
        style === 'standard'
          ? styles.standard
          : style === 'outlined_primary'
          ? styles.outlined_primary
          : styles.text
      }`}
      onClick={onClick}
    >
      <div style={{ paddingLeft: icon && '0.75rem' }}>
        {icon && <span class='material-symbols-outlined'>{icon}</span>}
        <p className='label-large'>{label}</p>
      </div>
    </div>
  );
}
