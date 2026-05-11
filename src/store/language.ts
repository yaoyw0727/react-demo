import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import flagCn from '@/assets/images/flag_zh-CN.svg';
import flagEn from '@/assets/images/flag_en-US.svg';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 可选语言列表
 */
export const languages: { key: Language; image: string; label: string; labelEn: string; nativeLabel: string }[] = [
  { key: 'zh-CN', image: flagCn, label: '中文', labelEn: 'Chinese', nativeLabel: '中文' },
  { key: 'en-US', image: flagEn, label: '英文', labelEn: 'English', nativeLabel: '英文' },
];

/**
 * 语言状态接口
 */
interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  resetLanguage: () => void;
}

/**
 * 默认语言设置
 */
const defaultValues = {
  language: 'zh-CN' as Language,
};

/**
 * 创建语言设置 Store
 * 使用 persist 中间件将状态持久化到 localStorage
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      ...defaultValues,
      setLanguage: (lang: Language) => set({ language: lang }),
      resetLanguage: () => set(defaultValues),
    }),
    {
      name: 'language-config',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
    }
  )
);