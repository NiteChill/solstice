import { useEffect, useState } from 'react';
import './default.scss';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [data, setData] = useState(''),
    [theme, setTheme] = useState('light');

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setTheme('dark');

    // async function getData() {
    //   const response = await fetch('http://localhost:3000/hello', {
    //     method: 'GET',
    //     mode: 'cors',
    //   })
    //     .then((res) => res.json())
    //     .then((data) => setData(data.message));
    // }
    // getData();
  }, []);
  return (
    <div className={`App ${theme}`}>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
