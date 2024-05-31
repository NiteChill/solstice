import Chip from '../Chip/Chip';
import IconButton from '../IconButton/IconButton';
import styles from './FilterSidesheet.module.scss';
import { useEffect, useState } from 'react';

export default function FilterSidesheet({
  isOpen,
  setIsOpen,
  tags,
  selectedTags,
  setSelectedTags,
}) {
  const [sidesheetState, setSidesheetState] = useState(isOpen);
  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
  }, [isOpen]);
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
            window.innerWidth < 500
              ? '100%'
              : window.innerWidth < 1000 &&
                (sidesheetState ? 'clamp(0px, 100%, 21.25rem)' : 0),
        }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>Filters</h1>
            <IconButton icon='close' onClick={() => setIsOpen(false)} />
          </header>
          <main>
            {/* <p className='label-medium'>Filter by tags</p> */}
            <div className={styles.tags}>
              {tags.map((tag) => (
                <Chip
                  key={tag.label}
                  icon={tag.icon}
                  label={tag.label}
                  active={selectedTags?.includes(tag.label)}
                  onClick={() => {
                    const newTags = selectedTags?.includes(tag.label)
                      ? selectedTags?.filter((el) => el !== tag.label)
                      : [...selectedTags, tag.label];
                    setSelectedTags(newTags);
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
