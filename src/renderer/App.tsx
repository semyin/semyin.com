import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';
import '@/assets/css/reset.css';
import '@/assets/css/App.css'
import reactLogo from '@/assets/react.svg';
import nestLogo from '@/assets/nestjs.svg';
import reactRouterLogo from '@/assets/react-router.svg';

const App: React.FC = () => {

  const [count, setCount] = useState(0)

  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://nestjs.com" target="_blank">
          <img src={nestLogo} className="logo nestjs" alt="Nestjs logo" />
        </a>
        <a href="https://reactrouter.com" target="_blank">
          <img src={reactRouterLogo} className="logo react-router" alt="React-Router logo" />
        </a>
      </div>
      <h1>Vite + React + Nestjs + React-Router</h1>
      <div className="card">
        <button onClick={() => setCount((count: number) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <nav>
        <Link to="/">Home</Link>
        <span> </span>
        <Link to="/about">About</Link>
        <span> </span>
        <Link to="/detail/1">Detail</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
