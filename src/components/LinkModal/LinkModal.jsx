import styles from './LinkModal.module.scss';

export default function LinkModal({isOpen, setIsOpen}) {
  return (
    <div className={`${styles.modal} ${isOpen ? styles.is_open : undefined}`}>
      <div className={styles.backdrop}></div>
      <div className={styles.container}></div>
    </div>
  )
}