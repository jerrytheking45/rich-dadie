import api from './api';
import type {
  CreatePlatformSettingRequest,
  PlatformSetting,
  PlatformSettingsResponse,
  UpdatePlatformSettingRequest,
} from '@/src/lib/types/platformSettings';

interface PlatformSettingResponse {
  setting: PlatformSetting;
}

interface PlatformSettingMutationResponse {
  message: string;
  setting: PlatformSetting;
}

export const platformSettingsApi = {
  async listPublic(): Promise<PlatformSetting[]> {
    const response = await api.get<PlatformSettingsResponse>(
      '/platform-settings/public'
    );

    return response.data.settings;
  },

  async list(): Promise<PlatformSetting[]> {
    const response = await api.get<PlatformSettingsResponse>(
      '/admin/platform-settings/'
    );

    return response.data.settings;
  },

  async get(key: string): Promise<PlatformSetting> {
    const response = await api.get<PlatformSettingResponse>(
      `/admin/platform-settings/${encodeURIComponent(key)}`
    );

    return response.data.setting;
  },

  async create(
    data: CreatePlatformSettingRequest
  ): Promise<PlatformSetting> {
    const response = await api.post<PlatformSettingMutationResponse>(
      '/admin/platform-settings/',
      data
    );

    return response.data.setting;
  },

  async update(
    key: string,
    data: UpdatePlatformSettingRequest
  ): Promise<PlatformSetting> {
    const response = await api.put<PlatformSettingMutationResponse>(
      `/admin/platform-settings/${encodeURIComponent(key)}`,
      data
    );

    return response.data.setting;
  },

  async delete(key: string): Promise<void> {
    await api.delete(
      `/admin/platform-settings/${encodeURIComponent(key)}`
    );
  },
};
