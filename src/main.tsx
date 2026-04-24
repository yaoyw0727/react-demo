/**
 * 入口文件
 * 初始化 React 应用，挂载到 DOM 元素并应用主题配置
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeConfig from './components/ThemeConfig';
import './utils/i18n';
import './assets/styles/global.less';
import './assets/styles/antd-override.less';

// 创建根节点并渲染应用
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    {/* ThemeConfig 提供主题配置，包括深色/浅色模式和主题色 */}
    <ThemeConfig>
      <App />
    </ThemeConfig>
  </React.StrictMode>
);