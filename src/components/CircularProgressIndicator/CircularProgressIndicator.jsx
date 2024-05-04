import styles from './CircularProgressIndicator.module.scss';

export default function CircularProgressIndicator({ size = 24 }) {
  return (
    <div className={styles.progress_indicator} style={{ width: `${size}px` }}>
      <svg viewBox='25 25 50 50'>
        <circle
          className='path'
          cx='50'
          cy='50'
          r='20'
          fill='none'
          strokeWidth='4'
          strokeMiterlimit='10'
        />
      </svg>
    </div>
  );
}
