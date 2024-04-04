import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Account from './pages/account/account';
import Article from './pages/article/article';
import Discover from './pages/discover/discover';
import Editor from './pages/editor/editor';
import Login from './pages/login/Login';
import MyArticles from './pages/my_articles/MyArticles';
import SignUp from './pages/sign_up/SignUp';

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
        path: '/editor',
        element: <Editor />,
      },
      {
        path: '/sign_up',
        element: <SignUp />,
      }
    ],
  },
]);
