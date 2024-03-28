import styles from './IconButton.module.scss';

export default function IconButton({
  style = 'standard',
  icon = 'settings',
  avatar = false,
  overridePadding = false,
  highContrast = false,
  onClick,
}) {
  return (
    <div
      className={`${styles.icon_button} ${
        style === 'filled_small'
          ? styles.filled_small
          : style === 'filled'
          ? styles.filled
          : style === 'filled_small_primary'
          ? styles.filled_small_primary
          : styles.standard
      } ${overridePadding && styles.override_padding} ${
        style === 'standard' && highContrast && styles.high_contrast
      }`}
      onClick={onClick}
    >
      <div>
        <div>
          {style === 'filled_small' || style === 'filled_small_primary' ? (
            <div
              style={{
                background:
                  style === 'filled_small'
                    ? 'var(--surface-container-high)'
                    : 'var(--secondary-container)',
              }}
            ></div>
          ) : (
            avatar && <img src={avatar} alt='profilePicture' />
          )}

          {!avatar && <span className='material-symbols-outlined'>{icon}</span>}
        </div>
      </div>
    </div>
  );
}
