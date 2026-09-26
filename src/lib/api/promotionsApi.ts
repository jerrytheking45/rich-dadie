
import api from './api';

import type {
  ActivePromotionsResponse,
  CreatePromotionPayload,
  Promotion,
  PromotionWithPlan,
  PromotionsResponse,
  UpdatePromotionPayload,
  UpdatePromotionStatusPayload,
} from '@/src/lib/types/promotion';

const promotionsApi = {
  /**
   * Public: list currently active promotions.
   */
  async listActive(): Promise<PromotionWithPlan[]> {
    const response =
      await api.get<ActivePromotionsResponse>('/promotions');

    return response.data.promotions;
  },

  /**
   * Public: get one active promotion.
   */
  async getActive(
    promotionId: string
  ): Promise<PromotionWithPlan> {
    const response =
      await api.get<PromotionWithPlan>(
        `/promotions/${promotionId}`
      );

    return response.data;
  },

  /**
   * Admin: list all promotions.
   */
  async list(): Promise<Promotion[]> {
    const response =
      await api.get<PromotionsResponse>(
        '/admin/promotions'
      );

    return response.data.promotions;
  },

  /**
   * Admin: get one promotion.
   */
  async get(
    promotionId: string
  ): Promise<Promotion> {
    const response =
      await api.get<Promotion>(
        `/admin/promotions/${promotionId}`
      );

    return response.data;
  },

  /**
   * Admin: create promotion.
   */
  async create(
    payload: CreatePromotionPayload
  ): Promise<Promotion> {
    const response =
      await api.post<Promotion>(
        '/admin/promotions',
        payload
      );

    return response.data;
  },

  /**
   * Admin: update promotion.
   */
  async update(
    promotionId: string,
    payload: UpdatePromotionPayload
  ): Promise<Promotion> {
    const response =
      await api.put<Promotion>(
        `/admin/promotions/${promotionId}`,
        payload
      );

    return response.data;
  },

  /**
   * Admin: change promotion status.
   */
  async updateStatus(
    promotionId: string,
    payload: UpdatePromotionStatusPayload
  ): Promise<Promotion> {
    const response =
      await api.patch<Promotion>(
        `/admin/promotions/${promotionId}/status`,
        payload
      );

    return response.data;
  },

  /**
   * Admin: delete promotion.
   */
  async remove(
    promotionId: string
  ): Promise<void> {
    await api.delete(
      `/admin/promotions/${promotionId}`
    );
  },
};

export default promotionsApi;