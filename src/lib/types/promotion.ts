
//src/lib/types/promotion.ts

export type PromotionStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export type PromotionType =
  | 'PLAN_LAUNCH'
  | 'OFFER'
  | 'BONUS'
  | 'ANNOUNCEMENT'
  | 'GENERAL';

export interface Promotion {
  id: string;
  plan_id?: string;

  title: string;
  description: string;
  type: PromotionType;

  image?: string;

  cta_text?: string;
  cta_url?: string;

  status: PromotionStatus;

  starts_at?: string;
  ends_at?: string;

  display_order: number;

  created_by?: string;

  created_at: string;
  updated_at: string;
}

export interface PromotionWithPlan extends Promotion {
  plan_name?: string;
  plan_description?: string;
  plan_image?: string;
  plan_minimum_amount?: number;
  plan_duration_days?: number;
  plan_expected_return_rate?: number;
  plan_status?: string;
  plan_featured?: boolean;
}

export interface PromotionsResponse {
  promotions: Promotion[];
}

export interface ActivePromotionsResponse {
  promotions: PromotionWithPlan[];
}

export interface CreatePromotionPayload {
  plan_id?: string;
  title: string;
  description: string;
  type?: PromotionType;
  image?: string;
  cta_text?: string;
  cta_url?: string;
  status?: PromotionStatus;
  starts_at?: string;
  ends_at?: string;
  display_order?: number;
}

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export interface UpdatePromotionStatusPayload {
  status: PromotionStatus;
}