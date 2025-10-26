import { useScore } from "../hooks/useScore";
import { RiskGauge } from "./ui/RiskGauge";

export function RiskGaugePanel() {
  const { loading, data, error, evaluate } = useScore();

  const gaugeValue = data ? data.risk_score * 100 : 0;

  return (
    <div className="w-full rounded-2xl border border-gray-200 p-4 md:p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold">Evaluación de Riesgo</h3>
        <button
          onClick={() => evaluate()}
          disabled={loading}
          className="rounded-lg px-3 py-2 bg-black text-white text-sm disabled:opacity-60"
        >
          {loading ? "Evaluando..." : "Probar transacción"}
        </button>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <RiskGauge value={gaugeValue} color={data?.color} reasons={data?.reasons} />
      {data && (
        <div className="mt-4 text-xs text-gray-600">
          Modelo: <b>{data.ml_score.toFixed(3)}</b> · Reglas: <b>{data.rule_score.toFixed(3)}</b>
        </div>
      )}
    </div>
  );
}
