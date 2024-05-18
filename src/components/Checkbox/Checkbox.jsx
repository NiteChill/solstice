import styles from './Checkbox.module.scss';

export default function Checkbox({ isChecked, onClick }) {
  return (
    <div className={`${styles.checkbox} ${isChecked && styles.checked}`} onClick={onClick}>
      <div>
        <div></div>
        {isChecked && (
          <span className='material-symbols-outlined'>check_small</span>
        )}
      </div>
    </div>
  );
}
