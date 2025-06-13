import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LoginPage from './pages/login';
import MainLayout from './components/layout/MainLayout';
import { ROUTES } from './constants';
import './App.css';

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('lighthouse_token');
  
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 登录页面 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          {/* 主应用布局 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
          
          {/* 默认重定向到仪表盘 */}
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 