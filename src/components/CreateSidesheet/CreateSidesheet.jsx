import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import styles from './CreateSidesheet.module.scss';
import Chip from '../Chip/Chip';
import Checkbox from '../Checkbox/Checkbox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateSidesheet({
  isOpen,
  setIsOpen,
  setLoading,
  setEdit,
  article = false,
  setArticle,
  user,
  tags,
  setIsOpenDelete,
}) {
  const [sidesheetState, setSidesheetState] = useState(isOpen),
    navigate = useNavigate(),
    [content, setContent] = useState({
      thumbnail: '',
      title: '',
      tags: [],
      privacy: 'public',
      enable_comments: true,
    }),
    [sortedTags, setSortTags] = useState(tags),
    [isOpenTags, setIsOpenTags] = useState(true),
    [isOpenPrivacy, setIsOpenPrivacy] = useState(true),
    handleCreate = async () => {
      setIsOpen(false);
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/create_article',
        content,
        {
          withCredentials: true,
        }
      );
      if (response.data?.id) {
        setLoading(false);
        return response.data.id;
      } else {
        setLoading(false);
        return false;
      }
    },
    handleUpdate = async () => {
      setLoading(true);
      setIsOpen(false);
      const response = await axios.post(
        'http://localhost:3000/api/update_article_data',
        { ...content, id: article._id, authorId: article.authorId },
        {
          withCredentials: true,
        }
      );
      if (response.data.state === 'ok') {
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    };

  useEffect(() => {
    isOpen
      ? setSidesheetState(true)
      : setTimeout(() => setSidesheetState(false), 300);
  }, [isOpen]);

  useEffect(() => {
    setContent({
      thumbnail: article.thumbnail ?? '',
      title: article.title ?? '',
      tags: article.tags ?? [],
      privacy: article.privacy ?? 'public',
      enable_comments: article.enable_comments ?? true,
    });
  }, [article, isOpen]);
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
            window.innerWidth < 900 &&
            (sidesheetState ? 'clamp(0px, 100%, 21.25rem)' : 0),
        }}
      >
        <div className={styles.sidesheet}>
          <header>
            <h1 className='title-large'>{article ? 'Settings' : 'Create'}</h1>
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
                  onInput={(event) => {
                    if (!event.target.files[0]) return;
                    const reader = new FileReader();
                    reader.addEventListener('load', (e) => {
                      setContent({
                        ...content,
                        thumbnail: e.target.result,
                      });
                    });
                    reader.readAsDataURL(event.target.files[0]);
                  }}
                />
              </div>
              <input
                type='text'
                placeholder='Title'
                className='body-large'
                value={content?.title}
                onInput={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
              />
            </div>
            <div className={styles.settings}>
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
              <div className={styles.tags}>
                <header
                  style={{
                    margin: isOpenTags && '0.5rem 0 0.625rem 0',
                  }}
                  onClick={() => setIsOpenTags(!isOpenTags)}
                >
                  <span className='material-symbols-outlined'>folder</span>
                  <p className='body-large'>Categories</p>
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
                  {tags.map((tag) => (
                    <Chip
                      key={tag.label}
                      icon={tag.icon}
                      label={tag.label}
                      active={content.tags?.includes(tag.label)}
                      onClick={() => {
                        const newTags = content.tags?.includes(tag.label)
                          ? content.tags?.filter((el) => el !== tag.label)
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
              <div className={styles.enable_comments}>
                <p className='body-large'>Allow comments</p>
                <Checkbox
                  isChecked={content.enable_comments}
                  onClick={() =>
                    setContent({
                      ...content,
                      enable_comments: !content.enable_comments,
                    })
                  }
                />
              </div>
              {article.authorId === user?.id && user && (
                <div className={styles.delete}>
                  <Button
                    style='text-error'
                    icon='delete'
                    label='Delete article'
                    onClick={() => setIsOpenDelete(true)}
                  />
                </div>
              )}
            </div>
          </main>
          <footer>
            <Button
              label={article ? 'Save' : 'Create'}
              disabled={
                !content.title?.replace(/\s+/g, '') || !content.thumbnail
              }
              onClick={async () => {
                if (article._id) {
                  if (article.authorId === user?.id) {
                    const response = handleUpdate();
                    if (response) {
                      setArticle({ ...article, ...content });
                    }
                  }
                } else {
                  const id = await handleCreate();
                  if (id) {
                    navigate(`/article/${id}`);
                    setEdit(true);
                  }
                }
              }}
            />
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
