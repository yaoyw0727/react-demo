/**
 * 入口文件
 * 初始化 React 应用，挂载到 DOM 元素并应用主题配置
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import ThemeConfig from './components/ThemeConfig';
import i18n from './utils/i18n';
import './assets/styles/global.less';
import './assets/styles/antd-override.less';

// 创建根节点并渲染应用
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeConfig>
        <App />
      </ThemeConfig>
    </I18nextProvider>
  </React.StrictMode>
);