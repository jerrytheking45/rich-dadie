export type PlatformSettingValueType =
  | 'STRING'
  | 'INTEGER'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'JSON';

export type PlatformSettingCategory =
  | 'GENERAL'
  | 'INVESTMENT'
  | 'DEPOSITS'
  | 'WITHDRAWALS'
  | 'BONUSES'
  | 'SECURITY'
  | 'NOTIFICATIONS'
  | 'BLOCKCHAIN';

export interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  value_type: PlatformSettingValueType;
  category: PlatformSettingCategory;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformSettingsResponse {
  settings: PlatformSetting[];
}

export interface CreatePlatformSettingRequest {
  key: string;
  value: string;
  value_type: PlatformSettingValueType;
  category: PlatformSettingCategory;
  description: string;
  is_public: boolean;
}

export interface UpdatePlatformSettingRequest {
  value: string;
  value_type: PlatformSettingValueType;
  category: PlatformSettingCategory;
  description: string;
  is_public: boolean;
}

export const PLATFORM_SETTING_CATEGORIES: PlatformSettingCategory[] = [
  'GENERAL',
  'INVESTMENT',
  'DEPOSITS',
  'WITHDRAWALS',
  'BONUSES',
  'SECURITY',
  'NOTIFICATIONS',
  'BLOCKCHAIN',
];

export const PLATFORM_SETTING_VALUE_TYPES: PlatformSettingValueType[] = [
  'STRING',
  'INTEGER',
  'DECIMAL',
  'BOOLEAN',
  'JSON',
];
