import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Account from './pages/account/account';
import Article from './pages/article/article';
import Discover from './pages/discover/discover';
import MyArticles from './pages/my_articles/MyArticles';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Discover />,
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
    ],
  },
]);
