import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';
import LoadingElement from './components/LoadingElement/LoadingElement';
import { useTiptap } from './hooks/useTiptap';
import CreateSidesheet from './components/CreateSidesheet/CreateSidesheet';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';

export default function App() {
  const [theme, setTheme] = useState('light'),
    location = useLocation().pathname,
    [user, setUser] = useState('loading'),
    [appWidth, setAppWidth] = useState(window.innerWidth),
    [edit, setEdit, article, setArticle, editor] = useTiptap(),
    [isOpenLink, setIsOpenLink] = useState(false),
    [isOpenImage, setIsOpenImage] = useState(false),
    [loading, setLoading] = useState(false),
    [isOpenCreateSidesheet, setIsOpenCreateSidesheet] = useState(false),
    [isOpenMenu, setIsOpenMenu] = useState(true),
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
      { icon: 'self_improvement', label: 'Self-improvement' },
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
      const response = await axios.get('http://localhost:3000/api', {
        withCredentials: true,
      });
      setUser(response.data.user);
    })();
  }, []);
  useEffect(() => {
    setIsOpenCreateSidesheet(false);
    if (location.slice(0, 8) !== '/article') {
      setEdit(false);
      setArticle(null);
    } else {
      // setIsOpenMenu(false)
    }
  }, [location]);

  useEffect(() => {
    edit ? setIsOpenMenu(false) : setIsOpenMenu(true);
  }, [edit]);
  return (
    <div className={`App ${theme} ${isOpenMenu ? 'open' : ''}`}>
      {user === 'loading' ? (
        <LoadingElement />
      ) : (
        <>
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
              ]}
            />
          </main>
          <NavigationMenu
            location={location}
            theme={theme}
            setTheme={setTheme}
            isOpen={isOpenMenu}
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
          />
        </>
      )}
    </div>
  );
}
