import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';
import LoadingElement from './components/LoadingElement/LoadingElement';
import { useTiptap } from './hooks/useTiptap';

export default function App() {
  const [theme, setTheme] = useState('light'),
    location = useLocation().pathname,
    [user, setUser] = useState('loading'),
    [edit, setEdit, article, setArticle, editor] = useTiptap();
  useEffect(() => {
    console.log(edit);
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');
    setTheme('light');

    async function getCookie() {
      const response = await axios.get('http://localhost:3000/api', {
        withCredentials: true,
      });
      setUser(response.data.user);
    }
    getCookie();
  }, []);
  useEffect(() => {
    location.slice(0, 8) !== '/article' && setEdit(false);
  }, [location]);
  return (
    <div className={`App ${theme}`}>
      {user === 'loading' ? (
        <LoadingElement />
      ) : (
        <>
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
            ]}
          />
        </>
      )}
    </div>
  );
}
