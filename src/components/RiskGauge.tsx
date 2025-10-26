interface RiskGaugeProps {
  /** 0-100 (derivado de risk_score*100) */
  value: number;
  /** color del backend si ya lo tienes: "verde"|"amarillo"|"rojo" */
  color?: "verde"|"amarillo"|"rojo";
  /** razones (opcional), para mostrarlas debajo si las inyectas */
  reasons?: string[];
}

export function RiskGauge({ value, color, reasons }: RiskGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const localColor = (() => {
    if (color === "rojo") return "#EF4444";
    if (color === "amarillo") return "#F59E0B";
    if (color === "verde") return "#10B981";
    // fallback por valor si no hay color
    if (value >= 75) return "#EF4444";
    if (value >= 45) return "#F59E0B";
    return "#10B981";
  })();

  const riskLabel = (() => {
    if (color === "rojo" || value >= 75)
      return { text: "ROJO", emoji: "🟥", desc: "Actividad fuera de tu patrón. Revisemos esta transacción." };
    if (color === "amarillo" || value >= 45)
      return { text: "AMARILLO", emoji: "🟨", desc: "Actividad que requiere atención." };
    return { text: "VERDE", emoji: "🟩", desc: "Todo en orden." };
  })();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r={radius} stroke="#1F2937" strokeWidth="16" fill="none" />
          <circle
            cx="96" cy="96" r={radius}
            stroke={localColor} strokeWidth="16" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl mb-1">{Math.round(value)}</div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{riskLabel.emoji}</span>
          <span className="text-xl" style={{ color: localColor }}>{riskLabel.text}</span>
        </div>
        <p className="text-sm text-gray-400 max-w-xs">{riskLabel.desc}</p>

        {reasons?.length ? (
          <ul className="mt-3 text-sm text-gray-300 max-w-sm list-disc text-left mx-auto pl-5">
            {reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
