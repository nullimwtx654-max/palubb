import {makeAutoObservable, runInAction} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import {serverStore} from './ServerStore';
import {modelStore} from './ModelStore';
import {Model, ModelOrigin, ModelType} from '../utils/types';

export type AIProviderId =
  | 'openai'
  | 'openrouter'
  | 'gemini'
  | 'groq'
  | 'deepseek'
  | 'mistral'
  | 'together'
  | 'custom';

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  label: string;
  baseUrl: string;
  defaultModel: string;
  activeModel: string;
  popularModels: string[];
  models: string[];
  enabled?: boolean;
  apiKey?: string; // in-memory cache, persisted in Keychain
}

export class AIProviderStore {
  activeProviderId: AIProviderId = 'openai';
  useApiKeyForChat: boolean = true;

  providers: AIProviderConfig[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      label: 'OpenAI',
      baseUrl: 'https://api.openai.com',
      defaultModel: 'gpt-4o-mini',
      activeModel: 'gpt-4o-mini',
      popularModels: ['gpt-4o-mini', 'gpt-4o', 'o3-mini', 'gpt-3.5-turbo'],
      models: ['gpt-4o-mini', 'gpt-4o', 'o3-mini', 'gpt-3.5-turbo'],
      enabled: true,
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      label: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api',
      defaultModel: 'openai/gpt-4o-mini',
      activeModel: 'openai/gpt-4o-mini',
      popularModels: [
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'deepseek/deepseek-chat',
        'meta-llama/llama-3.3-70b-instruct',
      ],
      models: [
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'deepseek/deepseek-chat',
        'meta-llama/llama-3.3-70b-instruct',
      ],
      enabled: true,
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      label: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      defaultModel: 'gemini-2.5-flash',
      activeModel: 'gemini-2.5-flash',
      popularModels: [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
      ],
      models: [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
      ],
      enabled: true,
    },
    {
      id: 'groq',
      name: 'Groq',
      label: 'Groq',
      baseUrl: 'https://api.groq.com/openai',
      defaultModel: 'llama-3.3-70b-versatile',
      activeModel: 'llama-3.3-70b-versatile',
      popularModels: [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
      ],
      models: [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
      ],
      enabled: true,
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      label: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com',
      defaultModel: 'deepseek-chat',
      activeModel: 'deepseek-chat',
      popularModels: ['deepseek-chat', 'deepseek-reasoner'],
      models: ['deepseek-chat', 'deepseek-reasoner'],
      enabled: true,
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      label: 'Mistral AI',
      baseUrl: 'https://api.mistral.ai',
      defaultModel: 'mistral-small-latest',
      activeModel: 'mistral-small-latest',
      popularModels: [
        'mistral-small-latest',
        'mistral-large-latest',
        'codestral-latest',
      ],
      models: [
        'mistral-small-latest',
        'mistral-large-latest',
        'codestral-latest',
      ],
      enabled: true,
    },
    {
      id: 'together',
      name: 'Together AI',
      label: 'Together AI',
      baseUrl: 'https://api.together.xyz',
      defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      activeModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      popularModels: [
        'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        'deepseek-ai/DeepSeek-V3',
      ],
      models: [
        'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        'deepseek-ai/DeepSeek-V3',
      ],
      enabled: true,
    },
    {
      id: 'custom',
      name: 'Custom OpenAI API',
      label: 'Custom OpenAI API',
      baseUrl: 'http://localhost:1234',
      defaultModel: 'default-model',
      activeModel: 'default-model',
      popularModels: ['default-model', 'local-model'],
      models: ['default-model', 'local-model'],
      enabled: true,
    },
  ];

  private keyCache: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AIProviderStore',
      properties: ['activeProviderId', 'useApiKeyForChat', 'providers'],
      storage: AsyncStorage,
    });
    this.loadAllKeysFromKeychain();
  }

  private async loadAllKeysFromKeychain() {
    for (const prov of this.providers) {
      try {
        const cred = await Keychain.getGenericPassword({
          service: `pocketpal_ai_provider_key_${prov.id}`,
        });
        if (cred && cred.password) {
          runInAction(() => {
            this.keyCache[prov.id] = cred.password;
            prov.apiKey = cred.password;
          });
        }
      } catch {
        // ignore keychain lookup error
      }
    }
  }

  get activeProvider(): AIProviderConfig {
    return (
      this.providers.find(p => p.id === this.activeProviderId) ||
      this.providers[0]
    );
  }

  getKey(providerId: string): string {
    const prov = this.providers.find(p => p.id === providerId);
    return this.keyCache[providerId] || prov?.apiKey || '';
  }

  hasKey(providerId: string): boolean {
    return Boolean(this.getKey(providerId).trim());
  }

  get hasActiveProviderKey(): boolean {
    return this.hasKey(this.activeProviderId);
  }

  setActiveProvider(providerId: AIProviderId) {
    runInAction(() => {
      this.activeProviderId = providerId;
    });
  }

  setUseApiKeyForChat(useKey: boolean) {
    runInAction(() => {
      this.useApiKeyForChat = useKey;
    });
  }

  async setApiKey(providerId: string, apiKey: string): Promise<void> {
    await this.setProviderConfigAndKey(providerId as AIProviderId, {
      apiKey,
      activateNow: Boolean(apiKey.trim()),
    });
  }

  setBaseUrl(providerId: string, baseUrl: string): void {
    const prov = this.providers.find(p => p.id === providerId);
    if (prov && baseUrl.trim()) {
      runInAction(() => {
        prov.baseUrl = baseUrl.trim();
      });
    }
  }

  setActiveModel(providerId: string, modelName: string): void {
    const prov = this.providers.find(p => p.id === providerId);
    if (prov && modelName.trim()) {
      runInAction(() => {
        prov.defaultModel = modelName.trim();
        prov.activeModel = modelName.trim();
      });
      if (this.hasKey(providerId)) {
        this.activateProviderModel(providerId as AIProviderId).catch(() => {});
      }
    }
  }

  async clearApiKey(providerId: string): Promise<void> {
    await this.clearKey(providerId as AIProviderId);
  }

  async setProviderConfigAndKey(
    providerId: AIProviderId,
    config: {
      apiKey?: string;
      baseUrl?: string;
      defaultModel?: string;
      activateNow?: boolean;
    },
  ): Promise<void> {
    const prov = this.providers.find(p => p.id === providerId);
    if (!prov) {
      return;
    }

    if (config.apiKey !== undefined) {
      const cleanKey = config.apiKey.trim();
      try {
        if (cleanKey) {
          await Keychain.setGenericPassword('api_key', cleanKey, {
            service: `pocketpal_ai_provider_key_${providerId}`,
          });
          runInAction(() => {
            this.keyCache[providerId] = cleanKey;
            prov.apiKey = cleanKey;
          });
        } else {
          await Keychain.resetGenericPassword({
            service: `pocketpal_ai_provider_key_${providerId}`,
          });
          runInAction(() => {
            delete this.keyCache[providerId];
            prov.apiKey = undefined;
          });
        }
      } catch (e) {
        console.warn('Keychain save error:', e);
        runInAction(() => {
          this.keyCache[providerId] = cleanKey;
          prov.apiKey = cleanKey || undefined;
        });
      }
    }

    runInAction(() => {
      if (config.baseUrl) {
        prov.baseUrl = config.baseUrl.trim();
      }
      if (config.defaultModel) {
        prov.defaultModel = config.defaultModel.trim();
        prov.activeModel = config.defaultModel.trim();
      }
    });

    if (config.activateNow) {
      await this.activateProviderModel(providerId);
    }
  }

  async clearKey(providerId: AIProviderId): Promise<void> {
    await this.setProviderConfigAndKey(providerId, {apiKey: ''});
  }

  getSelectedModel(providerId: AIProviderId): string {
    const prov = this.providers.find(p => p.id === providerId);
    return prov?.activeModel || prov?.defaultModel || 'gpt-4o-mini';
  }

  /**
   * Synchronizes the configured AI provider with ServerStore and registers it
   * into ModelStore as an active remote model so chat uses it seamlessly.
   */
  async activateProviderModel(
    providerId: AIProviderId,
  ): Promise<Model | undefined> {
    const prov = this.providers.find(p => p.id === providerId);
    if (!prov) {
      return undefined;
    }

    const key = this.getKey(providerId);
    const serverId = `ai_provider_${providerId}`;
    const selectedModel = prov.activeModel || prov.defaultModel;

    const existingServer = serverStore.servers.find(s => s.id === serverId);
    if (existingServer) {
      serverStore.updateServer(serverId, {
        name: prov.label,
        url: prov.baseUrl,
        apiKey: key,
      });
    } else {
      await serverStore.addServer({
        id: serverId,
        name: prov.label,
        url: prov.baseUrl,
        apiKey: key,
        status: 'connected',
      });
    }

    const modelId = `cloud_${providerId}_${selectedModel}`;
    const remoteModel: Model = {
      id: modelId,
      name: `${selectedModel} (${prov.label})`,
      size: 0,
      isDownloaded: true,
      downloadSpeed: '',
      progress: 100,
      origin: ModelOrigin.REMOTE,
      modelType: ModelType.CHAT,
      serverId,
      serverName: prov.label,
      chatTemplate: {
        name: 'ChatML',
        bosToken: '',
        eosToken: '',
        chatTemplate: '',
      },
    };

    modelStore.addModel(remoteModel);
    modelStore.selectModel(remoteModel);
    return remoteModel;
  }
}

export const aiProviderStore = new AIProviderStore();
