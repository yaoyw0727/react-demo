/**
 * 应用主组件
 * 配置 React Router 路由
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';
import { generateRouterConfig } from './routes/tools';

const App: React.FC = () => {
  // 从 routes 配置生成路由对象
  const routerConfig = generateRouterConfig(routes);

  // 递归渲染路由，支持子路由
  const renderRoutes = (routeList: typeof routerConfig) => {
    return routeList.map((route) => {
      // 如果有子路由，渲染父路由包含子路由
      if (route.children && route.children.length > 0) {
        return (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children.map((child) => (
              <Route key={child.path} path={child.path} element={child.element} />
            ))}
          </Route>
        );
      }
      // 无子路由，直接渲染
      return <Route key={route.path} path={route.path} element={route.element} />;
    });
  };

  return (
    <Router>
      <MainLayout>
        <Routes>
          {renderRoutes(routerConfig)}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;