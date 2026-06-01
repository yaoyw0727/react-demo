import { get, put } from '@/services/request';

export interface SettingsData {
  [key: string]: unknown;
}

export const settingsApi = {
  get: () => get<SettingsData>('/settings'),

  update: (settings: Record<string, unknown>) =>
    put<SettingsData>('/settings', { settings }),
};
