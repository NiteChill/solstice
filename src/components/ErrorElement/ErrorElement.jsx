import styles from './ErrorElement.module.scss';

export default function ErrorElement({ error }) {
  return (
    <div className={styles.error}>
      <p className='headline-medium'>Something went wrong...</p>
      <code className='label-medium'>{error}</code>
    </div>
  )
}
