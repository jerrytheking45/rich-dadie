
// src/lib/api/investmentApi.ts

import api from './api';

import type {
  InvestmentPlan,
  Investment,
  Deposit,
  Pagination,
  Asset,
  AssetNetwork,
  UserProfile,
  AccountDeposit,
  AccountDepositAddress,
  AccountDepositListResponse,
  PrepareAccountDepositRequest,
  PrepareAccountDepositResponse,
  AccountDepositStatus,
  BalanceSummary,
  PendingInvestmentDeposit,
} from '../types/investment';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((value) => toCamelCase(value)) as unknown as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(
        /_([a-z])/g,
        (_, letter: string) => letter.toUpperCase(),
      );

      newObj[camelKey] = toCamelCase(value);
    }

    return newObj as T;
  }

  return obj as T;
}

// -----------------------------------------------------------------------------
// Request / Response types
// -----------------------------------------------------------------------------

export interface CreateInvestmentRequest {
  plan_id: string;
  asset_id: string;
  network_id: string;
  amount: number;
}

export interface InvestmentListResponse {
  investments: Investment[];
  pagination: Pagination;
}

export interface DepositListResponse {
  deposits: Deposit[];
  pagination: Pagination;
}

// -----------------------------------------------------------------------------
// Investment API
// -----------------------------------------------------------------------------

export const investmentApi = {
  // ---------------------------------------------------------------------------
  // Plans
  // ---------------------------------------------------------------------------

  getPlans: async (): Promise<InvestmentPlan[]> => {
    const response = await api.get('/plans');

    return toCamelCase<InvestmentPlan[]>(response.data);
  },

  getPlan: async (
    planId: string,
  ): Promise<InvestmentPlan> => {
    const response = await api.get(`/plans/${planId}`);

    return toCamelCase<InvestmentPlan>(response.data);
  },

  // ---------------------------------------------------------------------------
  // Assets / Networks
  // ---------------------------------------------------------------------------

  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get('/assets');

    return toCamelCase<Asset[]>(response.data);
  },

  getNetworks: async (
    assetId: string,
  ): Promise<AssetNetwork[]> => {
    const response = await api.get(
      `/assets/${assetId}/networks`,
    );

    return toCamelCase<AssetNetwork[]>(response.data);
  },

  // ---------------------------------------------------------------------------
  // Investments
  // ---------------------------------------------------------------------------

  createInvestment: async (
    data: CreateInvestmentRequest,
  ): Promise<Investment> => {
    const response = await api.post(
      '/investments',
      data,
    );

    return toCamelCase<Investment>(
      response.data,
    );
  },

  getInvestments: async (
    page = 1,
    pageSize = 20,
  ): Promise<InvestmentListResponse> => {
    const response = await api.get(
      '/investments',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

    const data = response.data;

    return {
      investments: toCamelCase<Investment[]>(
        data.investments,
      ),
      pagination: toCamelCase<Pagination>(
        data.pagination,
      ),
    };
  },

  getInvestment: async (
    investmentId: string,
  ): Promise<Investment> => {
    const response = await api.get(
      `/investments/${investmentId}`,
    );

    return toCamelCase<Investment>(
      response.data,
    );
  },

  // ---------------------------------------------------------------------------
  // Investment deposits
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
// Investment deposits
// ---------------------------------------------------------------------------

submitDeposit: async (
  investmentId: string,
  txHash: string,
  proofUrl?: string,
): Promise<Deposit> => {
  const response = await api.post(
    `/investments/${investmentId}/deposit`,
    {
      tx_hash: txHash,
      ...(proofUrl
        ? { proof_url: proofUrl }
        : {}),
    },
  );

  return toCamelCase<Deposit>(
    response.data,
  );
},

getDeposit: async (
  investmentId: string,
): Promise<Deposit> => {
  const response = await api.get(
    `/investments/${investmentId}/deposit`,
  );

  return toCamelCase<Deposit>(
    response.data,
  );
},

getDeposits: async (
  page = 1,
  pageSize = 20,
): Promise<DepositListResponse> => {
  const response = await api.get(
    '/investments/deposits',
    {
      params: {
        page,
        page_size: pageSize,
      },
    },
  );

  const data = response.data;

  return {
    deposits: toCamelCase<Deposit[]>(
      Array.isArray(data.deposits)
        ? data.deposits
        : [],
    ),
    pagination: toCamelCase<Pagination>(
      data.pagination ?? {
        page,
        page_size: pageSize,
        total: 0,
      },
    ),
  };
},

getDepositById: async (
  depositId: string,
): Promise<Deposit> => {
  const response = await api.get(
    `/investments/deposits/${depositId}`,
  );

  return toCamelCase<Deposit>(
    response.data,
  );
},

getPendingInvestmentDeposits: async (): Promise<
  PendingInvestmentDeposit[]
> => {
  const response = await api.get(
    '/investments/pending',
  );

  const data = response.data;

  return toCamelCase<PendingInvestmentDeposit[]>(
    Array.isArray(data)
      ? data
      : Array.isArray(data?.pending)
        ? data.pending
        : [],
  );
},
  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get(
      '/investment/auth/me',
    );

    return toCamelCase<UserProfile>(
      response.data,
    );
  },

  // ---------------------------------------------------------------------------
  // Reinvestment
  // ---------------------------------------------------------------------------

 
reinvestFromBalance: async (
  data: CreateInvestmentRequest,
  idempotencyKey = crypto.randomUUID(),
): Promise<Investment> => {
  const response = await api.post(
    "/investments/reinvest",
    data,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  );

  return toCamelCase<Investment>(
    response.data,
  );
},



  // ---------------------------------------------------------------------------
  // Investment payment flow
  // ---------------------------------------------------------------------------

  prepareDeposit: async (
    data: CreateInvestmentRequest,
  ) => {
    const response = await api.post(
      '/investments/prepare',
      data,
    );

    return response.data;
  },

  confirmDeposit: async (data: {
    payment_token: string;
    tx_hash: string;
    plan_id: string;
    asset_id: string;
    network_id: string;
    amount: number;
  }): Promise<Investment> => {
    const response = await api.post(
      '/investments/confirm',
      data,
    );

    return toCamelCase<Investment>(
      response.data,
    );
  },

  // ===========================================================================
  // ACCOUNT DEPOSITS
  // External wallet -> user's ledger/account balance
  // ===========================================================================

  /**
   * Get the user's assigned deposit address.
   */
  getAccountDepositAddress: async (
    assetId: string,
    networkId: string,
  ): Promise<AccountDepositAddress> => {
    const response = await api.get(
      '/account-deposits/address',
      {
        params: {
          asset_id: assetId,
          network_id: networkId,
        },
      },
    );

    return toCamelCase<AccountDepositAddress>(
      response.data,
    );
  },

  /**
   * Get a specific deposit address by address ID.
   */
  getAccountDepositAddressById: async (
    addressId: string,
  ): Promise<AccountDepositAddress> => {
    const response = await api.get(
      `/account-deposits/addresses/${addressId}`,
    );

    return toCamelCase<AccountDepositAddress>(
      response.data,
    );
  },

  /**
   * Prepare a new account deposit.
   *
   * IMPORTANT:
   * The response is a PrepareAccountDepositResponse,
   * NOT an AccountDeposit.
   */
  prepareAccountDeposit: async (
  data: PrepareAccountDepositRequest,
): Promise<PrepareAccountDepositResponse> => {
  const response = await api.post(
    '/account-deposits/prepare',
    {
      asset_id: data.assetId,
      network_id: data.networkId,
      amount: data.amount,
    },
  );

  /*
   * IMPORTANT:
   *
   * Backend prepare response uses:
   *
   * deposit_id
   * deposit_address
   * expected_amount
   * received_amount
   * status
   *
   * Normalize it into our frontend
   * PrepareAccountDepositResponse shape.
   */
  const raw = response.data as Record<
    string,
    unknown
  >;

  const id =
    typeof raw.deposit_id === 'string'
      ? raw.deposit_id
      : typeof raw.id === 'string'
        ? raw.id
        : '';

  if (!id) {
    console.error(
      'Invalid account deposit prepare response:',
      raw,
    );

    throw new Error(
      'Deposit was created, but the backend did not return a deposit ID.',
    );
  }

  const expectedAmount = Number(
    raw.expected_amount ??
      raw.expectedAmount ??
      0,
  );

  const companyDepositAddress =
    typeof raw.deposit_address === 'string'
      ? raw.deposit_address
      : typeof raw.company_deposit_address ===
          'string'
        ? raw.company_deposit_address
        : typeof raw.companyDepositAddress ===
            'string'
          ? raw.companyDepositAddress
          : '';

  return {
    id,
    userId:
      typeof raw.user_id === 'string'
        ? raw.user_id
        : '',

    accountDepositAddressId:
      typeof raw.account_deposit_address_id ===
      'string'
        ? raw.account_deposit_address_id
        : '',

    assetId:
      typeof raw.asset_id === 'string'
        ? raw.asset_id
        : '',

    networkId:
      typeof raw.network_id === 'string'
        ? raw.network_id
        : '',

    expectedAmount,

    companyDepositAddress,

    status:
      raw.status as AccountDepositStatus,

    createdAt:
      typeof raw.created_at === 'string'
        ? raw.created_at
        : new Date().toISOString(),

    updatedAt:
      typeof raw.updated_at === 'string'
        ? raw.updated_at
        : new Date().toISOString(),
  };
},

  /**
   * Submit the TRON transaction hash for a prepared deposit.
   */
  submitAccountDeposit: async (
    depositId: string,
    txHash: string,
  ): Promise<AccountDeposit> => {
    const response = await api.post(
      `/account-deposits/${depositId}`,
      {
        tx_hash: txHash,
      },
    );

    return toCamelCase<AccountDeposit>(
      response.data,
    );
  },

  /**
   * Ask the backend to verify the account deposit.
   */
  verifyAccountDeposit: async (
    depositId: string,
  ): Promise<AccountDeposit> => {
    const response = await api.post(
      `/account-deposits/${depositId}/verify`,
    );

    return toCamelCase<AccountDeposit>(
      response.data,
    );
  },

  /**
   * Get one account deposit.
   */
  getAccountDeposit: async (
    depositId: string,
  ): Promise<AccountDeposit> => {
    const response = await api.get(
      `/account-deposits/${depositId}`,
    );

    return toCamelCase<AccountDeposit>(
      response.data,
    );
  },

  /**
   * Get current user's account deposits.
   */
  getAccountDeposits: async (
    page = 1,
    pageSize = 20,
    status?: AccountDepositStatus,
  ): Promise<AccountDepositListResponse> => {
    const response = await api.get(
      '/account-deposits/',
      {
        params: {
          page,
          page_size: pageSize,
          ...(status
            ? {
                status,
              }
            : {}),
        },
      },
    );

    const data = response.data;

    return {
      deposits: toCamelCase<AccountDeposit[]>(
        data.deposits,
      ),
      pagination: toCamelCase<Pagination>(
        data.pagination,
      ),
    };
  },

  // ---------------------------------------------------------------------------
// Balance Summary
// Authoritative user investment/account balance summary.
// ---------------------------------------------------------------------------

getBalanceSummary: async (): Promise<BalanceSummary> => {
  const response = await api.get(
    '/investments/balance-summary',
  );

  return toCamelCase<BalanceSummary>(
    response.data,
  );
},

};

//GET /api/v1/investments/balance-summary
