# NestJS React SSR Starter

A server-side rendering (SSR) project template based on NestJS and React, using Vite as the build tool.

## Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (based on Express)
- **Frontend**: [React 19](https://reactjs.org/) (with SSR support)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Build Tool**: [Vite](https://vitejs.dev/) + [vavite](https://github.com/cyco130/vavite)
- **State Management**: [Valtio](https://valtio.dev/)
- **Data Fetching**: [React Query](https://react-query.tanstack.com/)

## Project Features

- ✅ Server-side rendering (SSR) for improved initial load speed and SEO
- ✅ state management with Valtio
- ✅ data fetching with React Query
- ✅ NestJS backend architecture with good modularity and dependency injection support
- ✅ Client-side routing with React Router
- ✅ Integrated Vite development environment with hot reloading
- ✅ Static asset serving support
- ✅ Full TypeScript support

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

This will start the development server, typically accessible at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The built files will be output to `dist/client` and `dist/server` directories.

### Start Production Server

```bash
npm start
```

## Project Structure

```
src/
├── main.ts                 # NestJS application entry point
├── app.module.ts           # Root module
├── app.controller.ts       # Controller
├── middleware/
│   └── reactSsr.middleware.ts  # React SSR middleware
├── pages/                  # Page components
│   ├── About.tsx
│   ├── Detail.tsx
│   └── Home.tsx
│
├── hooks/                  # Custom React hooks
│
├── layouts/                # Page layout components
│   └── Default.tsx
│
├── renderer/               # React rendering related code
│   ├── AppContext.tsx      # React context for global state
│   ├── App.tsx             # React root component
│   ├── entry-client.tsx    # Client entry
│   ├── entry-server.tsx    # Server-side rendering entry
│   └── routes.tsx          # Application routes
│
├── store/                  # State management code
│   ├── index.ts            # Valtio state definition
│   └── StoreProvider.tsx   # Store provider component
│
├── assets/                 # Static assets
│   ├── css/
│   ├── nestjs.svg
│   ├── react-router.svg
│   └── react.svg
```

## How It Works

1. **Development Mode**: Uses Vite for development, integrating the NestJS server through the vavite plugin
2. **Build Process**: Divided into client and server build steps
   - Client build outputs to `dist/client`
   - Server build outputs to `dist/server`
3. **SSR Implementation**:
   - Handles all non-API requests through the `reactSsr.middleware.ts` middleware
   - Renders React components on the server using `react-dom/server`'s `renderToString` method
   - Injects the rendered HTML into the `index.html` template
4. **Client Activation**: Uses `ReactDOM.hydrateRoot` for client-side activation

## Possible Improvements

1. Add database integration (such as TypeORM or Prisma)
2. Add state management library (such as Redux or Zustand)
3. Add unit tests and end-to-end tests
4. Add more example pages and components
5. Implement error handling and logging mechanisms
6. Add environment configuration management

## Deployment

The built application can be deployed to any server that supports Node.js. Ensure that the Node.js runtime environment is installed on the server.

```bash
# Build
npm run build

# Start
npm start
```

## License

MIT
