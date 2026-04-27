import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const zhCnModules = import.meta.glob('/src/**/locales/zh-cn/*.json', { eager: true });
const enUsModules = import.meta.glob('/src/**/locales/en-us/*.json', { eager: true });

const zhCnData: Record<string, any> = {};
const enUsData: Record<string, any> = {};

Object.values(zhCnModules).forEach((mod: any) => {
  if (mod.default && typeof mod.default === 'object') {
    Object.assign(zhCnData, mod.default);
  }
});

Object.values(enUsModules).forEach((mod: any) => {
  if (mod.default && typeof mod.default === 'object') {
    Object.assign(enUsData, mod.default);
  }
});

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCnData },
    'en-US': { translation: enUsData }
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  debug: import.meta.env.DEV,
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
});

export default i18n;