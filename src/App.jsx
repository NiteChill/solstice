import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';
import LoadingElement from './components/LoadingElement/LoadingElement';

export default function App() {
  const [theme, setTheme] = useState('light'),
    location = useLocation().pathname,
    [user, setUser] = useState('loading');

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');
    setTheme('light');

    async function getCookie() {
      const response = await axios.get('http://localhost:3000', { withCredentials: true });
      setUser(response.data.user);
    }
    getCookie();
  }, []);
  return (
    <div className={`App ${theme}`}>
      {user === 'loading' ? <LoadingElement /> : (
        <>
          <Navbar location={location} loggedIn={user && true} />
          <Outlet context={[user, setUser]} />
        </>
      )}
    </div>
  );
}
