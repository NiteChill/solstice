import styles from './Chip.module.scss';

export default function Chip({
  icon,
  label = 'label',
  active = false,
  onClick,
  overrideDone = false,
  low = false,
  close = false,
}) {
  return (
    <div
      className={`${styles.chip} ${active || close ? styles.active : undefined} ${
        low ? styles.low : undefined
      }`}
      onClick={onClick}
    >
      <div
        style={{ paddingLeft: ((active && !overrideDone) || icon) && '0.5rem' }}
      >
        {((active && !overrideDone) || icon) && (
          <span className='material-symbols-outlined'>
            {active ? 'done' : icon}
          </span>
        )}
        <p className='label-large'>{label}</p>
        {close && (
          <span className='material-symbols-outlined'>
            close
          </span>
        )}
      </div>
    </div>
  );
}
