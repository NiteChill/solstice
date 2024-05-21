import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Account from './pages/account/account';
import Article from './pages/article/article';
import Explore from './pages/explore/explore';
import Login from './pages/login/Login';
import MyArticles from './pages/my_articles/MyArticles';
import Search from './pages/search/search';
import SignUp from './pages/sign_up/SignUp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Explore />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/my_articles',
        element: <MyArticles />,
      },
      {
        path: '/article/:link',
        element: <Article />,
      },
      {
        path: '/account',
        element: <Account />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/sign_up',
        element: <SignUp />,
      }
    ],
  },
]);
