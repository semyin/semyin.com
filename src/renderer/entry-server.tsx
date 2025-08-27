import React from 'react';
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router';
import { renderToPipeableStream } from "react-dom/server";
import { dehydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { createRoutes } from './routes';
import { createInitialState, StoreProvider } from '@/store';
import { AppProvider, IGlobalState } from './AppContext';
import { PassThrough } from 'stream';

export async function render(req: { originalUrl: string, headers: Record<string, string>, cookies: Record<string, string> }) {

  // 1. app initial state
  const isLoggedIn = req?.cookies?.token; 
  const globalInitialState: IGlobalState = {
    context: 'this is inital context',
    user: isLoggedIn ? { isLoggedIn: true, name: 'SSR User' } : null,
  };


  // 2. app initial valtio store
  const initialValtioState = createInitialState({
    title: 'Server Rendered Title',
  });

  // 3. create HelmetProvider
  const helmetContext: { helmet?: any } = {};

  // 4. create QueryClient
  const queryClient = new QueryClient({ 
    defaultOptions: {
      queries: {
        //  The staleTime here should match the server-side or be adjusted according to your strategy.
        staleTime: 10 * 1000,
        // On the server, we usually do not want to retry failed queries.
        retry: false,
      },
    },
   });
 
  // 5. create routes using queryClient
  const routes = createRoutes(queryClient);
  
  // 6. create React Router's static handler
  const handler = createStaticHandler(routes);
 
  // 7. create a Fetch Request object, which is needed by handler.query
  const fetchRequest = new Request(new URL(req.originalUrl, `http://${req.headers.host}`), {
    method: 'GET',
    headers: req.headers,
  });
 
  // 8. Query the route and run the loaders. This is crucial!
  // handler.query will automatically call the loader functions of the matched routes.
  const context = await handler.query(fetchRequest);
 
  // If there is a redirect or a Response is thrown in the loader, return it directly.
  if (context instanceof Response) {
    throw context;
  }
  
  // 9. create static router using handler.dataRoutes and context
  const router = createStaticRouter(handler.dataRoutes, context);

  // 10. Return streaming function instead of static string
  return new Promise<{
    stream: NodeJS.ReadableStream;
    head: string;
    dehydratedState: any;
    globalInitialState: IGlobalState;
    initialValtioState: any;
  }>((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <React.StrictMode>
        <AppProvider initialState={globalInitialState}>
          <StoreProvider initialState={initialValtioState}>
            <HelmetProvider context={helmetContext}>
              <QueryClientProvider client={queryClient}>
                <StaticRouterProvider router={router} context={context} />
              </QueryClientProvider>
            </HelmetProvider>
          </StoreProvider >
        </AppProvider>
      </React.StrictMode>,
      {
        onAllReady() {
          // Wait for all data to be ready before streaming
          // This reduces flicker but may increase TTFB
          const dehydratedState = dehydrate(queryClient);
          queryClient.clear();

          const { helmet } = helmetContext;
          const head = helmet
            ? `
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${helmet.script.toString()}
            `
            : '';

          const stream = new PassThrough();
          pipe(stream);

          resolve({
            stream,
            head,
            dehydratedState,
            globalInitialState,
            initialValtioState,
          });
        },
        onShellError(error) {
          didError = true;
          reject(error);
        },
        onError(error) {
          didError = true;
          console.error('Streaming SSR Error:', error);
        },
      }
    );

    // Set a timeout to abort if streaming takes too long
    setTimeout(() => {
      if (!didError) {
        abort();
        reject(new Error('SSR streaming timeout'));
      }
    }, 10000); // 10 second timeout
  });
}
