import { RouteObject } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import App from './App';
import ErrorPage from '@/pages/ErrorPage/';
import { lazyImport } from '@/utils/lazyImport';

const Home = lazyImport(() => import('@/pages/Home'));
const About = lazyImport(() => import('@/pages/About'));
const Categories = lazyImport(() => import('@/pages/Categories'));
const Tags = lazyImport(() => import('@/pages/Tags'));
const Detail = lazyImport(() => import('@/pages/Detail'));

const createRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home.Page />,
        loader: Home.loader(queryClient),
      },
      {
        path: 'about',
        element: <About.Page />,
        loader: About.loader(queryClient),
      },
      {
        path: 'categories',
        element: <Categories.Page />,
        loader: Categories.loader(queryClient),
      },
      {
        path: 'tags',
        element: <Tags.Page />,
        loader: Tags.loader(queryClient),
      },
      {
        path: 'detail/:id',
        loader: Detail.loader(queryClient),
        element: <Detail.Page />,
      }
    ],
  },
]

export { createRoutes };