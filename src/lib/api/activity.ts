import api from '@/src/lib/api/api';

export type ActivityType = 'DEPOSIT' | 'WITHDRAWAL';

export interface TransactionActivity {
  user_name: string;
  activity_type: ActivityType;
  amount: number;
  asset_symbol: string;
  activity_at: string;
}

interface ActivityResponse {
  activities: TransactionActivity[];
}

export const activityApi = {
  async list(limit = 20): Promise<TransactionActivity[]> {
    const response = await api.get<ActivityResponse>('/activity', {
      params: { limit },
    });

    return response.data.activities ?? [];
  },
};