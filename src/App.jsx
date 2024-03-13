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

    async function isAuthenticated() {
      const response = await axios.post(
        'http://localhost:3000/login',
        {
          name: 'Achille',
          password: '1234',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data);
    }
    isAuthenticated();
  }, []);
  return (
    <div className={`App ${theme}`}>
      <Navbar location={location} />
      <Outlet />
    </div>
  );
}

export default App;
