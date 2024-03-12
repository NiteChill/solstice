import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import axios from 'axios';

function App() {
  const [data, setData] = useState(''),
    [theme, setTheme] = useState('light'),
    navigate = useNavigate();

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');
    setTheme('light');

    async function isAuthenticated() {
      const response = await axios.get('http://localhost:3000/login');
      setData(response.data);
      // if (data) navigate("/yes");
      // else navigate("/oui");
    }
    isAuthenticated();
  }, []);
  return (
    <div className={`App ${theme}`}>
      <Navbar />
      <p>{data ? data.authenticated : 'loading...'}</p>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
