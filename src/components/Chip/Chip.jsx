import styles from './Chip.module.scss';

export default function Chip({
  icon,
  label = 'label',
  active = false,
  onClick,
}) {
  return (
    <div
      className={`${styles.chip} ${active ? styles.active : undefined}`}
      onClick={onClick}
    >
      <div style={{ paddingLeft: (active || icon) && '0.5rem' }}>
        {(active || icon) && (
          <span className='material-symbols-outlined'>
            {active ? 'done' : icon}
          </span>
        )}
        <p className='label-large'>{label}</p>
      </div>
    </div>
  );
}
