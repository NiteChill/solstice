import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';
import LoadingElement from './components/LoadingElement/LoadingElement';
import { useTiptap } from './hooks/useTiptap';
import CreateSidesheet from './components/CreateSidesheet/CreateSidesheet';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import ErrorElement from './components/ErrorElement/ErrorElement';
import FilterSidesheet from './components/FilterSidesheet/FilterSidesheet';
import DeleteModal from './components/DeleteModale/DeleteModal';

export default function App() {
  const [theme, setTheme] = useState('light'),
    location = useLocation().pathname,
    [user, setUser] = useState('loading'),
    [appWidth, setAppWidth] = useState(window.innerWidth),
    [edit, setEdit, article, setArticle, editor] = useTiptap(),
    [isOpenLink, setIsOpenLink] = useState(false),
    [isOpenImage, setIsOpenImage] = useState(false),
    [isOpenDelete, setIsOpenDelete] = useState(false),
    [loading, setLoading] = useState(false),
    [isOpenCreateSidesheet, setIsOpenCreateSidesheet] = useState(false),
    [isOpenMenu, setIsOpenMenu] = useState(true),
    [isOpenFilterSidesheet, setIsOpenFilterSidesheet] = useState(false),
    [error, setError] = useState(null),
    [selectedTags, setSelectedTags] = useState([]),
    tags = [
      { icon: 'newspaper', label: 'News' },
      { icon: 'sports_baseball', label: 'Sports' },
      { icon: 'movie', label: 'Entertainment' },
      { icon: 'science', label: 'Science' },
      { icon: 'health_and_safety', label: 'Health' },
      { icon: 'account_balance_wallet', label: 'Finance' },
      { icon: 'flight_takeoff', label: 'Travel' },
      { icon: 'restaurant', label: 'Food' },
      { icon: 'school', label: 'Education' },
      { icon: 'business_center', label: 'Business' },
      { icon: 'computer', label: 'Tech' },
      { icon: 'palette', label: 'Art' },
      { icon: 'music_note', label: 'Music' },
      { icon: 'videogame_asset', label: 'Gaming' },
      { icon: 'pets', label: 'Animals' },
      { icon: 'mood', label: 'Humor' },
      { icon: 'spa', label: 'Wellness' },
      { icon: 'people', label: 'Relationships' },
      { icon: 'child_care', label: 'Parenting' },
      { icon: 'local_taxi', label: 'Cars' },
    ];

  useEffect(() => {
    window.addEventListener('resize', () => {
      setAppWidth(window.innerWidth);
    });
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');
    setTheme('light');

    (async function getCookie() {
      try {
        const response = await axios.get('http://localhost:3000/api', {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        setError(error);
      }
    })();
  }, []);
  useEffect(() => {
    setIsOpenCreateSidesheet(false);
    setIsOpenFilterSidesheet(false);
    if (location.slice(0, 8) !== '/article') {
      setEdit(false);
      setArticle(null);
    } else {
      // setIsOpenMenu(false)
    }
  }, [location]);

  useEffect(() => {
    isOpenCreateSidesheet && setIsOpenFilterSidesheet(false);
  }, [isOpenCreateSidesheet]);
  useEffect(() => {
    isOpenFilterSidesheet && setIsOpenCreateSidesheet(false);
  }, [isOpenFilterSidesheet]);
  useEffect(() => {
    edit ? setIsOpenMenu(false) : setIsOpenMenu(true);
  }, [edit]);
  return (
    <div className={`App ${theme} ${isOpenMenu ? 'open' : undefined}`}>
      {user === 'loading' ? (
        <LoadingElement />
      ) : error === 'DB_CONNECTION_ERROR' ? (
        <ErrorElement error={error} />
      ) : (
        <>
          <FilterSidesheet
            isOpen={isOpenFilterSidesheet}
            setIsOpen={setIsOpenFilterSidesheet}
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <main>
            <Navbar
              location={location}
              loggedIn={user && true}
              avatar={
                user?.profilePicture &&
                `data:image/${
                  user.profilePicture.contentType
                };base64,${user.profilePicture.data.toString('base64')}`
              }
              edit={edit}
              setEdit={setEdit}
              title={article?.title}
              editor={editor}
              article={article}
              user={user}
              setIsOpenLink={setIsOpenLink}
              setIsOpenImage={setIsOpenImage}
              loading={loading}
              setLoading={setLoading}
              isOpenCreateSidesheet={isOpenCreateSidesheet}
              setIsOpenCreateSidesheet={setIsOpenCreateSidesheet}
              appWidth={appWidth}
              theme={theme}
              setTheme={setTheme}
            />

            <Outlet
              context={[
                user,
                setUser,
                edit,
                setEdit,
                article,
                setArticle,
                editor,
                isOpenLink,
                setIsOpenLink,
                isOpenImage,
                setIsOpenImage,
                loading,
                setLoading,
                appWidth,
                isOpenMenu,
                tags,
                isOpenCreateSidesheet,
                isOpenFilterSidesheet,
                setIsOpenFilterSidesheet,
                selectedTags,
                setSelectedTags,
              ]}
            />
          </main>
          <NavigationMenu
            location={location}
            theme={theme}
            setTheme={setTheme}
            isOpen={isOpenMenu}
            user={user}
          />
          <CreateSidesheet
            isOpen={isOpenCreateSidesheet}
            setIsOpen={setIsOpenCreateSidesheet}
            setLoading={setLoading}
            setEdit={setEdit}
            article={article?._id && article}
            setArticle={setArticle}
            user={user}
            tags={tags}
            setIsOpenDelete={setIsOpenDelete}
          />
          <DeleteModal
            isOpen={isOpenDelete}
            setIsOpen={setIsOpenDelete}
            article={article}
            setLoading={setLoading}
            setIsOpenCreateSidesheet={setIsOpenCreateSidesheet}
            user={user}
          />
        </>
      )}
    </div>
  );
}
