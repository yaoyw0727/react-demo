/**
 * 外观设置 Store
 * 使用 Zustand 管理布局模式、主题模式、主题色设置，并持久化到 localStorage
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LayoutMode, ThemeMode } from '../constants';
import { DEFAULT_APPEARANCE } from '../constants';

/**
 * 外观状态接口
 */
interface AppearanceState {
  layoutMode: LayoutMode;
  themeMode: ThemeMode;
  primaryColor: string;
  setLayoutMode: (mode: LayoutMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  resetAppearance: () => void;
}

/**
 * 创建外观设置 Store
 * 使用 persist 中间件将状态持久化到 localStorage
 */
export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      ...DEFAULT_APPEARANCE,
      setLayoutMode: (mode: LayoutMode) => set({ layoutMode: mode }),
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      setPrimaryColor: (color: string) => set({ primaryColor: color }),
      resetAppearance: () => set(DEFAULT_APPEARANCE),
    }),
    {
      name: 'appearance-config', // localStorage 键名
      storage: createJSONStorage(() => localStorage),
      // 只持久化这三个字段
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        themeMode: state.themeMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);