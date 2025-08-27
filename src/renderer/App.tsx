import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import '@/assets/css/reset.css';
import '@/assets/css/globals.css';

// 创建一个更平滑的loading组件
const SmoothLoader = () => (
  <div style={{
    minHeight: '200px', // 保持最小高度避免布局跳动
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    transition: 'opacity 0.2s ease-in-out'
  }}>
    <div>Loading...</div>
  </div>
);

const App: React.FC = () => {
  return (
    <>
      {/* <Suspense fallback={<SmoothLoader />}> */}
        <Outlet />
      {/* </Suspense> */}
    </>
  );
};

export default App;
