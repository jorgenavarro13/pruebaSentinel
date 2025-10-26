// src/lib/api.ts
const BASE =
  (import.meta as any).env?.VITE_API_URL ??
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : "") ??
  "http://127.0.0.1:8000";

export type Channel = "atm" | "branch" | "online" | "present" | "unknown";

export type ScoreTx = {
  customer_id: string;
  account_id: string;
  amount: number;
  currency: string;
  merchant_id: string;
  lat?: number;
  lon?: number;
  timestamp: string; // new Date().toISOString()
  channel: Channel;
};

export async function score(transactions: ScoreTx[]) {
  const res = await fetch(`${BASE}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactions }),
  });
  if (!res.ok) throw new Error("Scoring failed");
  return res.json() as Promise<{
    results: Array<{
      transaction_idx: number;
      risk_score: number;      // 0..1
      ml_score: number;
      rule_score: number;
      color: "verde" | "amarillo" | "rojo";
      reasons: string[];
      debug: Record<string, unknown>;
    }>;
  }>;
}
