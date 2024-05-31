import CircularProgressIndicator from '../CircularProgressIndicator/CircularProgressIndicator';
import styles from './IconButton.module.scss';

export default function IconButton({
  style = 'standard',
  icon = 'settings',
  avatar = false,
  overridePadding = false,
  highContrast = false,
  onClick,
  disabled = false,
  rotation = false,
  loading = false,
  label = false,
  stateLayer,
  iconColor,
  fill = false,
}) {
  return (
    <div
      className={`${styles.icon_button} ${
        disabled ? styles.disabled : undefined
      } ${rotation ? styles.rotation : undefined} ${
        stateLayer === 'error'
          ? styles.state_layer_error
          : stateLayer === 'primary'
          ? styles.state_layer_primary
          : undefined
      } ${
        style === 'filled_small'
          ? styles.filled_small
          : style === 'filled'
          ? styles.filled
          : style === 'filled_small_primary'
          ? styles.filled_small_primary
          : style === 'standard_primary'
          ? styles.standard_primary
          : style === 'filled_secondary_container'
          ? styles.filled_secondary_container
          : styles.standard
      } ${overridePadding && styles.override_padding} ${
        style === 'standard' && highContrast && styles.high_contrast
      }`}
      style={{ pointerEvents: loading && 'none' }}
      onClick={onClick}
    >
      <div>
        <div
          style={{
            paddingRight: label !== false && '0.75rem',
          }}
        >
          {style === 'filled_small' || style === 'filled_small_primary' ? (
            <div
              style={{
                background:
                  style === 'filled_small'
                    ? 'var(--surface-container-high)'
                    : 'var(--primary-container)',
              }}
            ></div>
          ) : (
            avatar && <img src={avatar} alt='profilePicture' />
          )}

          {!avatar && (
            <span
              className='material-symbols-outlined'
              style={{
                color: loading ? 'transparent' : iconColor && iconColor,
                fontVariationSettings: fill && "'FILL' 1",
              }}
            >
              {loading && <CircularProgressIndicator />}
              {icon}
            </span>
          )}
          {label && <p className='label-large'>{label}</p>}
        </div>
      </div>
    </div>
  );
}
