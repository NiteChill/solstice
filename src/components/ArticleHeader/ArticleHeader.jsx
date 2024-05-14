import styles from './ArticleHeader.module.scss';
import avatar from '../../assets/img/default_avatar.png';
import IconButton from '../IconButton/IconButton';

export default function ArticleHeader({ avatar = false, name, date, likes = 0, liked = false }) {
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let dateTxt;
  if (date) {
    let monthNbr = date.slice(5, 7);
    if (monthNbr.slice(0, 1) === '0') monthNbr = monthNbr.slice(1, 2);
    dateTxt = `${date.slice(8, 10)} ${month[monthNbr - 1]}, ${date.slice(0, 4)}`;
  }
  return (
    <div className={styles.header}>
      <div className={styles.user}>
        <div className={styles.profile_picture}>
          {avatar ? (
            <img src={avatar} alt='Profile' />
          ) : (
            <div>
              <span className='material-symbols-outlined'>person</span>
            </div>
          )}
        </div>
        <div className={styles.texts}>
          <h3 className='body-medium'>{name}</h3>
          <p className='body-small'>{dateTxt}</p>
        </div>
      </div>
      <div className={styles.container}>
        <IconButton icon='favorite' label={likes} stateLayer='error' iconColor={liked && 'error'} fill={liked && true} />
        <IconButton icon='comment' label='10' />
        <IconButton icon='share' />
      </div>
    </div>
  );
}
