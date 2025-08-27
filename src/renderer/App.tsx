import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import '@/assets/css/reset.css';
import '@/assets/css/globals.css';

const App: React.FC = () => {
  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense> */}

       <Outlet />
    </>
  );
};

export default App;
