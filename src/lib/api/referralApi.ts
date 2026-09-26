import api from "@/src/lib/api/api";

import type {
  ReferralCodeResponse,
  ReferralSummary,
  ReferralTeamResponse,
} from "../types/referral";

const referralApi = {
  async getCode(): Promise<ReferralCodeResponse> {
    const response = await api.get<ReferralCodeResponse>(
      "/referrals/code",
    );

    return response.data;
  },

  async getTeam(
    limit = 20,
    offset = 0,
  ): Promise<ReferralTeamResponse> {
    const response = await api.get<ReferralTeamResponse>(
      "/referrals/team",
      {
        params: {
          limit,
          offset,
        },
      },
    );

    return response.data;
  },

  async getSummary(): Promise<ReferralSummary> {
    const response = await api.get<ReferralSummary>(
      "/referrals/summary",
    );

    return response.data;
  },
};

export default referralApi;