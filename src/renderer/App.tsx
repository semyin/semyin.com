import React from 'react';
import { Outlet } from 'react-router';
import '@/assets/css/reset.css';
import '@/assets/css/globals.css';

const App: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
