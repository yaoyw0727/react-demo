import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp } from 'antd';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import { routes } from './routes';
import { generateRouterConfig } from './routes/tools';
import { useAuthStore } from './store/auth';
import { loadSettingsFromBackend } from './services/settingsSync';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
});

const App: React.FC = () => {
  const token = useAuthStore((s) => s.token);
  const routerConfig = useMemo(() => generateRouterConfig(routes), []);

  useEffect(() => {
    if (token) {
      loadSettingsFromBackend();
    }
  }, [token]);

  const innerRoutes = useMemo(() => {
    return routerConfig.map((route) => {
      if (route.children && route.children.length > 0) {
        return (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children.map((child) => {
              const relativePath = child.path.replace(route.path + '/', '');
              return (
                <Route key={child.path} path={relativePath} element={child.element} />
              );
            })}
          </Route>
        );
      }
      return <Route key={route.path} path={route.path} element={route.element} />;
    });
  }, [routerConfig]);

  return (
    <AntApp>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    {innerRoutes}
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AntApp>
  );
};

export default App;
