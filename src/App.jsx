import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';

function App() {
  const [data, setData] = useState(''),
    [theme, setTheme] = useState('light'),
    location = useLocation().pathname,
    navigate = useNavigate();

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');
    setTheme('light');

    async function getCookie() {
      const response = await axios.get('http://localhost:3000', {withCredentials: true});
      // setData(response.user);
      console.log(response);
    }
    getCookie();
  }, []);
  return (
    <div className={`App ${theme}`}>
      <Navbar location={location} />
      <Outlet />
    </div>
  );
}

export default App;
