import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { hydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { AppProvider } from './AppContext';
import { createRoutes } from './routes';
import { createInitialState, StoreProvider } from '@/store';

// fix hydration style flicker
if (typeof window !== 'undefined') {
  // remove temporary class added by server render
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // ensure remove any temporary properties that may affect styles after hydration
    const style = document.createElement('style');
    style.innerHTML = `
      body { opacity: 1 !important; }
      * { transition: none !important; }
    `;
    document.head.appendChild(style);
    
    // briefly delay to restore transition effects
    setTimeout(() => {
      style.innerHTML = '';
    }, 300);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The staleTime here should match the server-side or be adjusted according to your strategy.
      staleTime: 10 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const dehydratedState = (window as any).__REACT_QUERY_STATE__;

const initialState = (window as any).__INITIAL_STATE__;

const initialValtioState = (window as any).__INITIAL_VALTIO_STATE__ || createInitialState({});

hydrate(queryClient, dehydratedState);

const routes = createRoutes(queryClient);
const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <AppProvider initialState={initialState}>
      <StoreProvider initialState={initialValtioState}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
              <RouterProvider router={router} />
            </HydrationBoundary>
          </QueryClientProvider>
        </HelmetProvider>
      </StoreProvider>
    </AppProvider>
  </React.StrictMode>
);

// delete __REACT_QUERY_STATE__ from window to avoid memory leak
delete (window as any).__REACT_QUERY_STATE__;

// delete __INITIAL_STATE__ from window to avoid memory leak
delete (window as any).__INITIAL_STATE__;

// delete __INITIAL_VALTIO_STATE__ from window to avoid memory leak
delete (window as any).__INITIAL_VALTIO_STATE__;
