import { RouteObject } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import App from './App';
import * as Home from '@/pages/Home';
import * as About from '@/pages/About';
import * as Detail from '@/pages/Detail';

const createRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: '/',
    element: <App />,
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
        path: 'detail/:id',
        loader: Detail.loader(queryClient),
        element: <Detail.Page />,
      }
    ],
  },
]

export { createRoutes };