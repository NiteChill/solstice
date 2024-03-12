import styles from './IconButton.module.scss';

export default function IconButton({
  style = 'standard',
  icon = 'settings',
  avatar = false,
  overridePadding = false,
  highContrast = false,
}) {
  return (
    <div
      className={`${styles.icon_button} ${
        style === 'filled_small'
          ? styles.filled_small
          : style === 'filled'
          ? styles.filled
          : styles.standard
      } ${overridePadding && styles.override_padding} ${
        style === 'standard' && highContrast && styles.high_contrast
      }`}
    >
      <div>
        <div>
          <div
            style={{ background: style && `url(${avatar}) no-repeat center/cover`,}}
          ></div>
          {!avatar && (<span className='material-symbols-outlined'>{icon}</span>)}
        </div>
      </div>
    </div>
  );
}
