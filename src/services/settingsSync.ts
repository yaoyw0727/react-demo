import { settingsApi } from '@/services/api';
import { useAppearanceStore } from '@/store/appearance';
import { useLanguageStore } from '@/store/language';

export async function loadSettingsFromBackend() {
  try {
    const data = await settingsApi.get();
    const appearance = useAppearanceStore.getState();
    const language = useLanguageStore.getState();

    if (data.layoutMode) appearance.setLayoutMode(data.layoutMode as 'top' | 'side');
    if (data.themeMode) appearance.setThemeMode(data.themeMode as 'light' | 'dark');
    if (data.themeColor) appearance.setPrimaryColor(data.themeColor as string);
    if (data.language) language.setLanguage(data.language as 'zh-CN' | 'en-US');
  } catch {
    // 静默失败，使用本地默认值
  }
}

export async function syncSettingsToBackend() {
  try {
    const appearance = useAppearanceStore.getState();
    const language = useLanguageStore.getState();
    await settingsApi.update({
      layoutMode: appearance.layoutMode,
      themeMode: appearance.themeMode,
      themeColor: appearance.primaryColor,
      language: language.language,
    });
  } catch {
    // 静默失败，本地已保存
  }
}
