import { appEnv } from '@/environment';
import type { Request, Response, NextFunction } from 'express';
import { readFile } from 'fs/promises';
import viteDevServer from 'vavite/vite-dev-server';

// Cache template content in the production environment
let cachedTemplate: string | null = null;

// Clear the template cache
export function clearTemplateCache() {
  cachedTemplate = null;
}

async function reactSsrMiddleware(req: Request, res: Response, next: NextFunction) {
  // if API request, skip SSR
  if (req.url.startsWith('/api')) {
    return next();
  }
  
  const url = req.originalUrl;
  
  let template: string;
  let render;
  
  try {
    if (viteDevServer) {
      template = await readFile('./index.html', 'utf-8');
      template = await viteDevServer.transformIndexHtml(url, template);
      render = (await viteDevServer.ssrLoadModule('@/renderer/entry-server.tsx')).render;
    } else {
      // Use cached template content in the production environment
      if (!cachedTemplate) {
        cachedTemplate = await readFile('./dist/client/index.html', 'utf-8');
      }
      template = cachedTemplate;
      render = (await import('@/renderer/entry-server')).render;
    }
    
    const rendered = await render({
      originalUrl: req.originalUrl,
      headers: req.headers as Record<string, string>,
      cookies: req.cookies || {},
    });

    const dehydratedStateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(rendered.dehydratedState).replace(/</g, '\\u003c')}</script>`;

    const globalInitialStateScript = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(rendered.globalInitialState).replace(/</g, '\\u003c')}</script>`;

    const initialValtioStateScript = `<script>window.__INITIAL_VALTIO_STATE__ = ${JSON.stringify(rendered.initialValtioState).replace(/</g, '\\u003c')}</script>`;

    
    // add performance optimization response headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    
    // Split template into parts for streaming
    const [beforeApp, afterApp] = template.split('<!--app-html-->');
    
    // Send initial part of HTML
    const htmlStart = beforeApp
      .replace(`<!--app-head-->`, rendered.head ?? '');
    
    res.write(htmlStart);
    
    // Pipe the React stream
    rendered.stream.pipe(res, { end: false });
    
    // When streaming finishes, send the closing HTML with scripts
    rendered.stream.on('end', () => {
      const htmlEnd = afterApp
        .replace(`<!--app-initial-state-->`, globalInitialStateScript)
        .replace(`<!--app-initial-valtio-state-->`, initialValtioStateScript)
        .replace(`<!--app-data-->`, dehydratedStateScript);
      res.end(htmlEnd);
    });
    
    rendered.stream.on('error', (error: Error) => {
      console.error('Stream error:', error);
      const htmlEnd = afterApp
        .replace(`<!--app-initial-state-->`, globalInitialStateScript)
        .replace(`<!--app-initial-valtio-state-->`, initialValtioStateScript)
        .replace(`<!--app-data-->`, dehydratedStateScript);
      res.end(htmlEnd);
    });
   
  } catch (error) {

    if (error instanceof Response) {
      // If a Response is thrown in the loader, redirect to the specified location.
      return res.redirect(error.status, error.headers.get('Location') || '/');
    }

    console.error('SSR Error:', error);
    // return basic HTML when error
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Server Error</h1>
        <p>Please try again later.</p>
        ${ appEnv.isDev ? `<p>${String(error)}</p><p>Stack Trace:</p>
        <pre>${String((error as any).stack)}</pre>` : '' }
      </body>
      </html>
      `);
  }
}

export { reactSsrMiddleware };