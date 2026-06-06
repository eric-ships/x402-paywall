// Mock x402 protocol helpers
// In a real implementation these would interact with Base mainnet

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const PAYWALL_ADDRESS = "0x1234567890AbCdEf1234567890AbCdEf12345678";
export const BASE_CHAIN_ID = 8453;

export interface X402PaymentRequirement {
  x402Version: number;
  accepts: {
    scheme: "exact";
    network: "base-mainnet";
    maxAmountRequired: string; // USDC in 6-decimal units
    asset: string;
    payTo: string;
    extra?: {
      name: string;
      version: string;
    };
  }[];
  error?: string;
}

export interface X402PaymentProof {
  scheme: "exact";
  network: "base-mainnet";
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      validAfter: string;
      validBefore: string;
      nonce: string;
    };
  };
}

export interface X402FlowStep {
  step: number;
  label: string;
  direction: "request" | "response" | "internal";
  status: number | null;
  statusText: string | null;
  headers?: Record<string, string>;
  body?: unknown;
}

export function usdcToRaw(usdc: number): string {
  return Math.round(usdc * 1_000_000).toString();
}

export function rawToUsdc(raw: string): number {
  return parseInt(raw) / 1_000_000;
}

// Generate a realistic-looking mock payment requirement
export function buildPaymentRequirement(
  priceUsdc: number,
  payTo: string
): X402PaymentRequirement {
  return {
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: "base-mainnet",
        maxAmountRequired: usdcToRaw(priceUsdc),
        asset: USDC_ADDRESS,
        payTo,
        extra: {
          name: "USDC",
          version: "1",
        },
      },
    ],
  };
}

// Generate a mock payment proof (what the client would construct after signing)
export function buildMockPaymentProof(
  from: string,
  to: string,
  amountRaw: string
): X402PaymentProof {
  const now = Math.floor(Date.now() / 1000);
  const nonce =
    "0x" + Math.random().toString(16).slice(2).padStart(64, "0").slice(0, 64);
  const sig =
    "0x" +
    Array.from({ length: 130 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

  return {
    scheme: "exact",
    network: "base-mainnet",
    payload: {
      signature: sig,
      authorization: {
        from,
        to,
        value: amountRaw,
        validAfter: (now - 30).toString(),
        validBefore: (now + 300).toString(),
        nonce,
      },
    },
  };
}

// Build the full x402 protocol trace for the modal
export function buildX402FlowTrace(
  articleId: string,
  priceUsdc: number,
  authorAddress: string,
  payerAddress: string,
  txHash: string
): X402FlowStep[] {
  const amountRaw = usdcToRaw(priceUsdc);
  const paymentReq = buildPaymentRequirement(priceUsdc, authorAddress);
  const paymentProof = buildMockPaymentProof(payerAddress, authorAddress, amountRaw);
  const now = Math.floor(Date.now() / 1000);

  return [
    {
      step: 1,
      label: `GET /api/content/${articleId}`,
      direction: "request",
      status: null,
      statusText: null,
      headers: {
        Accept: "application/json",
        "User-Agent": "x402-client/1.0",
      },
    },
    {
      step: 1,
      label: "402 Payment Required",
      direction: "response",
      status: 402,
      statusText: "Payment Required",
      headers: {
        "Content-Type": "application/json",
        "X-402-Version": "1",
      },
      body: paymentReq,
    },
    {
      step: 2,
      label: "Constructing payment authorization...",
      direction: "internal",
      status: null,
      statusText: null,
      body: {
        action: "signTransferWithAuthorization",
        asset: "USDC",
        amount: `${priceUsdc} USDC`,
        from: payerAddress,
        to: authorAddress,
        validAfter: now - 30,
        validBefore: now + 300,
        nonce: paymentProof.payload.authorization.nonce,
      },
    },
    {
      step: 2,
      label: "Payment proof constructed",
      direction: "internal",
      status: null,
      statusText: null,
      body: {
        ...paymentProof,
        txHash,
        note: "Signed with Base Smart Account",
      },
    },
    {
      step: 3,
      label: `GET /api/content/${articleId}`,
      direction: "request",
      status: null,
      statusText: null,
      headers: {
        Accept: "application/json",
        "X-PAYMENT": btoa(JSON.stringify(paymentProof)).slice(0, 60) + "...",
        "User-Agent": "x402-client/1.0",
      },
    },
    {
      step: 3,
      label: "200 OK — Content delivered",
      direction: "response",
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
        "X-Payment-Receipt": txHash,
        "X-USDC-Settled": `${priceUsdc}`,
      },
      body: {
        content: "[Article content delivered]",
        paymentReceipt: {
          txHash,
          amount: `${priceUsdc} USDC`,
          network: "base-mainnet",
          confirmedAt: new Date().toISOString(),
        },
      },
    },
  ];
}

// Simulate a mock transaction hash
export function mockTxHash(): string {
  return (
    "0x" +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
}

// Mock payer wallet address (in real app: user's connected wallet)
export const MOCK_PAYER_ADDRESS =
  "0xDeAdBeEf1234567890AbCdEf1234567890AbCdEf";
