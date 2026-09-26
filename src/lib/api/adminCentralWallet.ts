
import api from "./api";

export interface CentralWalletResource {
  limit: number;
  used: number;
  available: number;
}

export interface CentralWalletStatus {
  address: string;
  network: string;
  trxBalance: number;
  usdtBalance: number;
  energy: CentralWalletResource;
  bandwidth: CentralWalletResource;
  freeBandwidth: CentralWalletResource;
  tronPower: CentralWalletResource;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  lastCheckedAt: string;
}

interface CentralWalletResourceResponse {
  limit?: number;
  used?: number;
  available?: number;
}

interface CentralWalletStatusResponse {
  address?: string;
  network?: string;

  trx_balance?: number;
  usdt_balance?: number;

  energy?: CentralWalletResourceResponse;
  bandwidth?: CentralWalletResourceResponse;
  free_bandwidth?: CentralWalletResourceResponse;
  tron_power?: CentralWalletResourceResponse;

  status?: string;
  last_checked_at?: string;
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

function resourceOrZero(
  resource?: CentralWalletResourceResponse,
): CentralWalletResource {
  return {
    limit: numberOrZero(resource?.limit),
    used: numberOrZero(resource?.used),
    available: numberOrZero(resource?.available),
  };
}

function normalizeStatus(
  status?: string,
): CentralWalletStatus["status"] {
  if (status === "HEALTHY") {
    return "HEALTHY";
  }

  if (status === "CRITICAL") {
    return "CRITICAL";
  }

  return "WARNING";
}

function normalizeCentralWalletStatus(
  response: CentralWalletStatusResponse,
): CentralWalletStatus {
  return {
    address: response.address ?? "",
    network: response.network ?? "TRON",

    trxBalance: numberOrZero(
      response.trx_balance,
    ),

    usdtBalance: numberOrZero(
      response.usdt_balance,
    ),

    energy: resourceOrZero(
      response.energy,
    ),

    bandwidth: resourceOrZero(
      response.bandwidth,
    ),

    freeBandwidth: resourceOrZero(
      response.free_bandwidth,
    ),

    tronPower: resourceOrZero(
      response.tron_power,
    ),

    status: normalizeStatus(
      response.status,
    ),

    lastCheckedAt:
      response.last_checked_at ?? "",
  };
}

export const adminCentralWalletApi = {
  getStatus: async (): Promise<CentralWalletStatus> => {
    const response =
      await api.get<CentralWalletStatusResponse>(
        "/admin/central-wallet",
      );

    return normalizeCentralWalletStatus(
      response.data,
    );
  },
};

