import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import styles from './CreateSidesheet.module.scss';
import Chip from '../Chip/Chip';
import Checkbox from '../Checkbox/Checkbox';

export default function CreateSidesheet({ isOpen, setIsOpen }) {
  const [sidesheetState, setSidesheetState] = useState(isOpen),
    [content, setContent] = useState({
      thumbnail: '',
      title: '',
      tags: [],
      privacy: 'public',
      enable_comments: true,
    }),
    tags = [
      { icon: 'local_hospital', label: 'Health' },
      { icon: 'account_balance_wallet', label: 'Finance' },
      { icon: 'people', label: 'Relationships' },
      { icon: 'flight_takeoff', label: 'Travel' },
      { icon: 'restaurant', label: 'Cooking' },
      { icon: 'apparel', label: 'Fashion' },
      { icon: 'house', label: 'Home' },
      { icon: 'computer', label: 'Tech' },
      { icon: 'movie', label: 'Entertainment' },
      { icon: 'newspaper', label: 'News' },
      { icon: 'sports_baseball', label: 'Sports' },
      { icon: 'business_center', label: 'Business' },
      { icon: 'self_improvement', label: 'Improvement' },
      { icon: 'child_care', label: 'Parenting' },
      { icon: 'school', label: 'Education' },
      { icon: 'science', label: 'Science' },
      { icon: 'palette', label: 'Art' },
      { icon: 'pets', label: 'Pets' },
      { icon: 'mood', label: 'Humor' },
      { icon: 'spa', label: 'Spirituality' },
    ],
    [sortedTags, setSortTags] = useState(tags),
    [isOpenTags, setIsOpenTags] = useState(true),
    [isOpenPrivacy, setIsOpenPrivacy] = useState(true);

  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
    setContent({
      thumbnail: '',
      title: '',
      tags: [],
      privacy: 'public',
      enable_comments: true,
    });
  }, [isOpen]);

  useEffect(() => {
    let unselected = [],
      selected = [];
    tags.forEach((tag) => {
      content.tags.includes(tag.label)
        ? (selected = [...selected, tag])
        : (unselected = [...unselected, tag]);
    });
    setSortTags([...selected, ...unselected]);
  }, [content.tags]);

  useEffect(() => console.log(content), [content])
  return (
    <>
      <div
        className={styles.backdrop}
        onClick={() => setIsOpen(false)}
        style={{ opacity: isOpen && 0.5, top: sidesheetState && 0 }}
      ></div>
      <div
        className={`${styles.container} ${isOpen ? styles.open : undefined}`}
        style={{
          width:
            window.innerWidth > 400 &&
            window.innerWidth < 800 &&
            (sidesheetState ? 'clamp(0px, 100%, 21.25rem)' : 0),
        }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>Create</h1>
            <IconButton icon='close' onClick={() => setIsOpen(false)} />
          </header>
          <main>
            <div className={styles.image_title}>
              {content?.thumbnail && (
                <label htmlFor='file' className={styles.thumbnail}>
                  <img src={content?.thumbnail} alt='thumbnail' />
                </label>
              )}
              <div className={styles.image_selector}>
                <label htmlFor='file' className='label-large'>
                  <span className='material-symbols-outlined'>
                    add_photo_alternate
                  </span>
                  {content?.thumbnail ? 'Change thumbnail' : 'Add thumbnail'}
                </label>
                <input
                  id='file'
                  type='file'
                  accept='image/*'
                  onInput={async (e) => {
                    setContent({
                      ...content,
                      thumbnail: URL.createObjectURL(e.target.files[0]),
                    });
                  }}
                />
              </div>
              <input
                type='text'
                placeholder='Title'
                className='body-large'
                onInput={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
              />
            </div>
            <div className={styles.settings}>
              <div className={styles.tags}>
                <header
                  style={{
                    margin: isOpenTags && '0.5rem 0 0.625rem 0',
                  }}
                  onClick={() => setIsOpenTags(!isOpenTags)}
                >
                  <span className='material-symbols-outlined'>folder</span>
                  <p className='body-large'>categories</p>
                  <span className='material-symbols-outlined'>
                    {isOpenTags ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </header>
                <div
                  style={{
                    height: !isOpenTags && 0,
                    opacity: !isOpenTags && 0,
                  }}
                >
                  {sortedTags.map((tag) => (
                    <Chip
                      key={tag.label}
                      icon={tag.icon}
                      label={tag.label}
                      active={content.tags.includes(tag.label)}
                      onClick={() => {
                        const newTags = content.tags.includes(tag.label)
                          ? content.tags.filter((el) => el !== tag.label)
                          : [...content.tags, tag.label];
                        setContent({
                          ...content,
                          tags: newTags ?? [],
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.privacy}>
                <header
                  style={{
                    margin: isOpenPrivacy && '0.5rem 0 0.625rem 0',
                  }}
                  onClick={() => setIsOpenPrivacy(!isOpenPrivacy)}
                >
                  <span className='material-symbols-outlined'>encrypted</span>
                  <p className='body-large'>Privacy</p>
                  <span className='material-symbols-outlined'>
                    {isOpenPrivacy
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'}
                  </span>
                </header>
                <div
                  style={{
                    height: !isOpenPrivacy && 0,
                    opacity: !isOpenPrivacy && 0,
                  }}
                >
                  <Chip
                    icon='lock_open_right'
                    label='Public'
                    active={content.privacy === 'public'}
                    onClick={() =>
                      setContent({ ...content, privacy: 'public' })
                    }
                  />
                  <Chip
                    icon='lock'
                    label='Private'
                    active={content.privacy === 'private'}
                    onClick={() =>
                      setContent({ ...content, privacy: 'private' })
                    }
                  />
                </div>
              </div>
              <div className={styles.enable_comments}>
                <p className='body-large'>Allow comments</p>
                <Checkbox isChecked={content.enable_comments} onClick={() => setContent({ ...content, enable_comments: !content.enable_comments })} />
              </div>
            </div>
          </main>
          <footer>
            <Button label='Create' disabled={!content.title.replace(/\s+/g, '')} />
            <Button
              label='Cancel'
              style='outlined_primary'
              onClick={() => setIsOpen(false)}
            />
          </footer>
        </div>
      </div>
    </>
  );
}
