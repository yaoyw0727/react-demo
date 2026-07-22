import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ModelItem {
  id: string;
  name: string;
}

export interface ProviderItem {
  provider: string;
  providerName: string;
  icon: string;
  color: string;
  models: ModelItem[];
}

interface AiModelState {
  availableModels: ProviderItem[];
  selectedProvider: string;
  selectedModel: string;
  loaded: boolean;
  fetchModels: () => Promise<void>;
  setModel: (provider: string, model: string) => void;
}

export const useModelStore = create<AiModelState>()(
  persist(
    (set) => ({
      availableModels: [],
      selectedProvider: '',
      selectedModel: '',
      loaded: false,

      fetchModels: async () => {
        try {
          const res = await fetch('/api/ai/models');
          if (!res.ok) return;
          const list: ProviderItem[] = await res.json();
          const stored = useModelStore.getState();
          const firstProvider = list[0];
          if (!firstProvider) return;

          let provider = stored.selectedProvider;
          let model = stored.selectedModel;

          const exists = list.some(
            (p) => p.provider === provider && p.models.some((m) => m.id === model)
          );

          if (!exists) {
            provider = firstProvider.provider;
            model = firstProvider.models[0].id;
            set({ selectedProvider: provider, selectedModel: model });
          }

          set({ availableModels: list, loaded: true });
        } catch {
        }
      },

      setModel: (provider: string, model: string) => set({ selectedProvider: provider, selectedModel: model }),
    }),
    {
      name: 'ai-model-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedProvider: state.selectedProvider,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
