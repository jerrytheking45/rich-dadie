export interface ReferralCodeResponse {
  code: string;
  link: string;
}

export interface ReferralTeamMember {
  referralId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCreatedAt: string;

  referralStatus: string;

  referredAt: string;
  qualifiedAt?: string | null;
  rewardedAt?: string | null;

  hasActivePlan: boolean;

  rewardId?: string | null;
  rewardAmount: number;
  rewardAssetId?: string | null;
  rewardCreatedAt?: string | null;
}

export interface ReferralTeamResponse {
  members: ReferralTeamMember[];
  total: number;
  limit: number;
  offset: number;
}

export interface ReferralSummary {
  totalInvited: number;
  activePlans: number;
  rewardedMembers: number;
  totalEarned: number;
}