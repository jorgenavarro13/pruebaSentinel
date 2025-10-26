import { useState } from "react";
import { score, type ScoreTx } from "../lib/api";

export function useScore(defaultTx: Partial<ScoreTx> = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | {
    risk_score:number; ml_score:number; rule_score:number;
    color:"verde"|"amarillo"|"rojo"; reasons:string[]; debug:Record<string,unknown>;
  }>(null);
  const [error, setError] = useState<string|null>(null);

  async function evaluate(txOverrides: Partial<ScoreTx> = {}) {
    setLoading(true); setError(null);
    try {
      const tx: ScoreTx = {
        customer_id: "cust_demo_1",
        account_id: "acc_001",
        amount: 1200,
        currency: "USD",
        merchant_id: "m_far_city",
        lat: 19.4326, lon: -99.1332,
        timestamp: new Date().toISOString(),
        channel: "online",
        ...defaultTx, ...txOverrides,
      };
      const res = await score([tx]);
      const r = res.results?.[0];
      if (r) {
        setData({
          risk_score: r.risk_score, ml_score: r.ml_score, rule_score: r.rule_score,
          color: r.color, reasons: r.reasons ?? [], debug: r.debug ?? {},
        });
      } else {
        setData(null);
      }
    } catch (e:any) { setError(e?.message ?? "Error"); setData(null); }
    finally { setLoading(false); }
  }

  return { loading, data, error, evaluate };
}
