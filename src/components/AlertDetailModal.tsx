import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageCircle,
  User,
  FileSearch,
  Building2,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import type { Transaction } from "./mockData";
import { toast } from "sonner@2.0.3";
// 👇 NUEVO: usa la API real de scoring
import { score, type ScoreTx } from "../lib/api";

interface AlertDetailModalProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

type ReportStep =
  | "SUBMITTED"
  | "AUTO_REVIEW"
  | "MERCHANT_CONTACT"
  | "PROVISIONAL_CREDIT"
  | "RESOLVED";

const STEP_ORDER: ReportStep[] = [
  "SUBMITTED",
  "AUTO_REVIEW",
  "MERCHANT_CONTACT",
  "PROVISIONAL_CREDIT",
  "RESOLVED",
];

const STEP_META: Record<
  ReportStep,
  { label: string; mode: "auto" | "human"; icon: any }
> = {
  SUBMITTED: { label: "Reporte recibido", mode: "auto", icon: FileSearch },
  AUTO_REVIEW: { label: "Revisión automática", mode: "auto", icon: ShieldCheck },
  MERCHANT_CONTACT: { label: "Contacto con el comercio", mode: "human", icon: Building2 },
  PROVISIONAL_CREDIT: { label: "Abono provisional (si aplica)", mode: "human", icon: Mail },
  RESOLVED: { label: "Resolución final", mode: "human", icon: CheckCircle2 },
};

type StepStatus = "pending" | "processing" | "done";

// --- Helpers de mapeo para merchant y channel (fáciles de extender)
function merchantIdFromName(name?: string): string {
  const n = (name || "").toLowerCase();
  if (n.includes("far") && n.includes("city")) return "m_far_city";
  if (n.includes("stream")) return "m_stream_1";
  if (n.includes("café") || n.includes("cafe") || n.includes("coffee")) return "m_coffee_1";
  if (n.includes("tiend")) return "m_grocery_1";
  if (n.includes("atm") || n.includes("banco")) return "m_atm_1";
  // fallback genérico: usa el nombre como id “slug”
  return (name || "merchant_unknown").toLowerCase().replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
}

function channelFromCategoryOrTx(tx: Transaction): "present" | "online" | "atm" | "unknown" {
  const m = (tx.merchant || "").toLowerCase();
  const c = (tx.category || "").toLowerCase();
  if (m.includes("aliexpress") || m.includes("amazon") || m.includes("netflix") || m.includes("spotify")) return "online";
  if (c.includes("atm")) return "atm";
  if (c.includes("alimentos") || c.includes("transporte") || c.includes("conveniencia") || c.includes("compras")) return "present";
  return "unknown";
}

function parseMockDateTimeToISO(dateStr: string, timeStr: string): string {
  // Ej: "25 Oct 2025" + "03:42 AM" -> ISO en UTC
  const months: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const [d, mon, y] = dateStr.split(" ");
  const [hhmm, ampm] = timeStr.split(" ");
  let [hh, mm] = hhmm.split(":").map(Number);
  if (ampm?.toUpperCase() === "PM" && hh !== 12) hh += 12;
  if (ampm?.toUpperCase() === "AM" && hh === 12) hh = 0;
  const dt = new Date(Date.UTC(Number(y), months[mon], Number(d), hh, mm || 0, 0));
  return dt.toISOString();
}

function defaultLatLon(tx: Transaction): { lat?: number; lon?: number } {
  // usa coordinates si existen; si no, CDMX por defecto
  if (tx.coordinates?.lat != null && tx.coordinates?.lng != null) {
    return { lat: tx.coordinates.lat, lon: tx.coordinates.lng };
  }
  return { lat: 19.4326, lon: -99.1332 };
}

export function AlertDetailModal({ transaction, open, onClose }: AlertDetailModalProps) {
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ReportStep | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Record<ReportStep, StepStatus>>({
    SUBMITTED: "pending",
    AUTO_REVIEW: "pending",
    MERCHANT_CONTACT: "pending",
    PROVISIONAL_CREDIT: "pending",
    RESOLVED: "pending",
  });
  const [tempLocked, setTempLocked] = useState(false);

  // 👇 NUEVO: estado para el resultado real del backend
  const [loadingScore, setLoadingScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<null | {
    risk_score: number;
    ml_score: number;
    rule_score: number;
    color: "verde" | "amarillo" | "rojo";
    reasons: string[];
    debug: Record<string, unknown>;
  }>(null);

  useEffect(() => {
    if (!open) {
      setShowHelpCenter(false);
      setReportId(null);
      setCurrentStep(null);
      setTempLocked(false);
      setStepStatuses({
        SUBMITTED: "pending",
        AUTO_REVIEW: "pending",
        MERCHANT_CONTACT: "pending",
        PROVISIONAL_CREDIT: "pending",
        RESOLVED: "pending",
      });
      setScoreResult(null);
      setLoadingScore(false);
      return;
    }

    // ⚡️ Al abrir el modal, evalúa el riesgo con el backend
    (async () => {
      try {
        setLoadingScore(true);

        const whenISO = parseMockDateTimeToISO(transaction.date, transaction.time);
        const { lat, lon } = defaultLatLon(transaction);

        const tx: ScoreTx = {
          customer_id: "cust_demo_1",
          account_id: transaction.accountId ?? "acc_001",
          amount: transaction.amount,
          currency: "USD",
          merchant_id: merchantIdFromName(transaction.merchant),
          // Si tienes lat/lon reales, añádelos aquí:
          // lat: ..., lon: ...,
          lat, lon,
          timestamp:whenISO,
          channel: channelFromCategoryOrTx(transaction),
        };
        const res = await score([tx]);
        const r = res.results?.[0];
        if (r) {
          setScoreResult({
            risk_score: r.risk_score,
            ml_score: r.ml_score,
            rule_score: r.rule_score,
            color: r.color,
            reasons: r.reasons ?? [],
            debug: r.debug ?? {},
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingScore(false);
      }
    })();
  }, [open, transaction]);

  // Badge original (mock)…
  const getRiskBadge = () => {
    if (transaction.riskLevel === "red") {
      return {
        bg: "bg-gradient-to-r from-[#D22E1E] to-[#B42318]",
        text: "text-white",
        label: "COMPRA SOSPECHOSA",
        icon: AlertTriangle,
      };
    }
    if (transaction.riskLevel === "yellow") {
      return {
        bg: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
        text: "text-white",
        label: "GASTO HORMIGA",
        icon: AlertTriangle,
      };
    }
    return {
      bg: "bg-white",
      text: "text-gray-900",
      label: "COMPRA NORMAL",
      icon: CheckCircle2,
    };
  };

  // …pero si tenemos color real del backend, lo usamos
  const risk = useMemo(() => {
    const base = getRiskBadge();
    if (!scoreResult) return base;
    if (scoreResult.color === "rojo") {
      return {
        bg: "bg-gradient-to-r from-[#D22E1E] to-[#B42318]",
        text: "text-white",
        label: "ALERTA DE RIESGO",
        icon: AlertTriangle,
      };
    }
    if (scoreResult.color === "amarillo") {
      return {
        bg: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
        text: "text-white",
        label: "REVISIÓN SUGERIDA",
        icon: AlertTriangle,
      };
    }
    return {
      bg: "bg-white",
      text: "text-gray-900",
      label: "COMPRA NORMAL",
      icon: CheckCircle2,
    };
  }, [transaction, scoreResult]);

  const RiskIcon = risk.icon;

  // --- Acciones mock que ya tenías
  // (si tienes un ./api con estos métodos, mantenlos;
  // si no, déjalos como “no-ops” o adapta a tu backend real)
  const api = {
    confirmTransaction: async (_id: string) => Promise.resolve(),
    createReport: async (_: { transactionId: string }) => Promise.resolve({ id: crypto.randomUUID() }),
    updateReportStatus: async (_: string, __: ReportStep) => Promise.resolve(),
    tempLockAccount: async (_: string, __: boolean) => Promise.resolve(),
  };

  const handleConfirm = async () => {
    try {
      await api.confirmTransaction(transaction.id);
      toast.success("Transacción confirmada", { description: "Gracias por verificar esta compra" });
      onClose();
    } catch {
      toast.error("No se pudo confirmar la transacción");
    }
  };

  const setStep = (step: ReportStep, status: StepStatus) => {
    setStepStatuses((prev) => ({ ...prev, [step]: status }));
  };

  const markAndPatch = async (step: ReportStep) => {
    if (!reportId) return;
    await api.updateReportStatus(reportId, step);
    setCurrentStep(step);
  };

  const runAutoPipeline = async () => {
    setStep("SUBMITTED", "processing");
    await markAndPatch("SUBMITTED");
    await new Promise((r) => setTimeout(r, 1200));
    setStep("SUBMITTED", "done");

    setStep("AUTO_REVIEW", "processing");
    await markAndPatch("AUTO_REVIEW");
    await new Promise((r) => setTimeout(r, 2000));
    setStep("AUTO_REVIEW", "done");

    await new Promise((r) => setTimeout(r, 1500));
    setStep("MERCHANT_CONTACT", "done");
    await markAndPatch("MERCHANT_CONTACT");

    await new Promise((r) => setTimeout(r, 1500));
    setStep("PROVISIONAL_CREDIT", "done");
    await markAndPatch("PROVISIONAL_CREDIT");

    await new Promise((r) => setTimeout(r, 1800));
    setStep("RESOLVED", "done");
    await markAndPatch("RESOLVED");
  };

  const handleReport = async () => {
    setShowHelpCenter(true);
    try {
      const created = await api.createReport({ transactionId: transaction.id });
      setReportId(created.id);
      setCurrentStep("SUBMITTED");
      toast.info("Reporte enviado", { description: "Iniciamos la revisión" });
      runAutoPipeline();
    } catch {
      toast.error("No se pudo crear el reporte");
    }
  };

  const handleTempLock = async () => {
    try {
      await api.tempLockAccount(transaction.accountId, true);
      setTempLocked(true);
      toast.success("Tarjeta bloqueada temporalmente");
    } catch {
      toast.error("No se pudo bloquear temporalmente");
    }
  };

  const handleChatbot = () => toast.info("Conectando con asistente virtual...", { description: "Un momento por favor" });
  const handleHumanSupport = () => toast.info("Conectando con agente...", { description: "En breve te atenderá un asesor" });

  const renderStatusBadge = (step: ReportStep) => {
    const st = stepStatuses[step];
    if (st === "processing") {
      return (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs border-amber-300 text-amber-700 bg-amber-50">
          <Loader2 className="size-3 animate-spin" /> Procesando…
        </span>
      );
    }
    if (st === "done") {
      return (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs border-emerald-300 text-emerald-700 bg-emerald-50">
          <CheckCircle2 className="size-3" /> Completado
        </span>
      );
    }
    return (
      <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-gray-300 text-gray-600">
        {STEP_META[step].mode === "auto" ? "Automático" : "Revisión humana"}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-[#1A1A1A] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#004877] mb-6">
            Detalle de compra
          </DialogTitle>
        </DialogHeader>

        {/* Transaction Header */}
        <div className="bg-[#F7F8FA] rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl text-[#004877] mb-2">{transaction.merchant}</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {transaction.date} - {transaction.time}
                </span>
                {transaction.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {transaction.location}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <span className="text-gray-500">Categoría:</span>
                  {transaction.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl text-[#004877] mb-2">
                ${transaction.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
              <Badge className={`${risk.bg} ${risk.text} border-none px-3 py-1.5 flex items-center gap-1.5`}>
                <RiskIcon className="size-4" />
                {risk.label}
              </Badge>
              {loadingScore && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" /> Evaluando riesgo…
                </div>
              )}
              {scoreResult && (
                <div className="mt-2 text-xs text-gray-600">
                  Riesgo: <b>{scoreResult.risk_score.toFixed(3)}</b> · Modelo: <b>{scoreResult.ml_score.toFixed(3)}</b> · Reglas: <b>{scoreResult.rule_score.toFixed(3)}</b>
                </div>
              )}
            </div>
          </div>

          {/* Risk Reasons (usa backend si existen; si no, cae a mock) */}
          {(scoreResult?.reasons?.length || (transaction.riskReasons?.length ?? 0) > 0) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="flex items-center gap-2 text-[#004877] mb-3">
                <AlertTriangle className="size-5" />
                ¿Por qué te alertamos?
              </h4>
              <div className="space-y-2">
                {(scoreResult?.reasons?.length ? scoreResult.reasons.map((txt, idx) => (
                  <div key={`br-${idx}`} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="mt-1">
                      {/* marca por color: si vino "rojo"/"amarillo"/"verde" pintamos acorde */}
                      <div className={`size-2 rounded-full ${
                        scoreResult.color === "rojo" ? "bg-[#D22E1E]" :
                        scoreResult.color === "amarillo" ? "bg-[#F59E0B]" :
                        "bg-[#10B981]"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#004877]">{txt}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Evaluación automática comparando tu patrón y reglas de seguridad.
                      </p>
                    </div>
                  </div>
                )) : transaction.riskReasons!.map((reason, idx) => (
                  <div key={`mr-${idx}`} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="mt-1">
                      {reason.severity === "high" && <div className="size-2 bg-[#D22E1E] rounded-full" />}
                      {reason.severity === "medium" && <div className="size-2 bg-[#F59E0B] rounded-full" />}
                      {reason.severity === "low" && <div className="size-2 bg-[#10B981] rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#004877]">{reason.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{reason.description}</p>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!showHelpCenter && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={handleConfirm}
              className="h-14 bg-[#004877] hover:bg-[#015C99] text-white rounded-2xl transition-all shadow-md hover:shadow-lg"
            >
              <CheckCircle2 className="size-5 mr-2" />
              Sí fui yo
            </Button>
            <Button
              onClick={handleReport}
              className="h-14 bg-gradient-to-r from-[#D22E1E] to-[#B42318] hover:from-[#B42318] hover:to-[#D22E1E] text-white rounded-2xl transition-all shadow-md hover:shadow-lg"
            >
              <XCircle className="size-5 mr-2" />
              No fui yo
            </Button>
          </div>
        )}

        {/* Help Center (igual que tenías) */}
        {showHelpCenter && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-[#004877] to-[#015C99] rounded-2xl p-6 text-white">
              <h3 className="text-xl mb-2 flex items-center gap-2">
                <CheckCircle2 className="size-6" />
                Centro de ayuda Capital One
              </h3>
              <p className="text-sm text-white/80">
                Protegemos tu cuenta. Seguiremos estas etapas y te avisaremos aquí mismo.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="text-sm text-[#004877] font-medium">Bloqueo temporal de tarjeta</p>
                <p className="text-xs text-gray-600">Evita nuevos cargos mientras revisamos.</p>
              </div>
              <Button
                variant={tempLocked ? "default" : "outline"}
                className={`rounded-full ${tempLocked ? "bg-[#004877] text-white" : ""}`}
                onClick={handleTempLock}
                disabled={tempLocked}
              >
                {tempLocked ? "Bloqueada" : "Activar"}
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg text-[#004877] mb-4">Progreso del caso</h4>
              <div className="space-y-4">
                {STEP_ORDER.map((step, idx) => {
                  const Icon = STEP_META[step].icon;
                  const status = stepStatuses[step];
                  const tone =
                    status === "done" ? "bg-[#004877] text-white" :
                    status === "processing" ? "bg-amber-200 text-amber-800" :
                    "bg-gray-200 text-gray-400";
                  return (
                    <div className="flex gap-4" key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 ${tone}`}>
                          {status === "processing" ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
                        </div>
                        {idx < STEP_ORDER.length - 1 && (
                          <div className={`w-0.5 h-10 ${status === "done" ? "bg-[#004877]" : "bg-gray-200"} mt-2`} />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2">
                          <h5 className={`${status !== "pending" ? "text-[#004877]" : "text-gray-400"}`}>
                            {STEP_META[step].label}
                          </h5>
                          {renderStatusBadge(step)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {step === "SUBMITTED" && "Tu reporte fue registrado."}
                          {step === "AUTO_REVIEW" && "Nuestro sistema analiza el patrón de la transacción."}
                          {step === "MERCHANT_CONTACT" && "Contactamos al establecimiento para validar detalles."}
                          {step === "PROVISIONAL_CREDIT" && "Podría aplicarse un abono provisional según políticas."}
                          {step === "RESOLVED" && "Te notificaremos aquí la resolución del caso."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg text-[#004877] mb-4">Preguntas comunes</h4>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-200">
                  <AccordionTrigger className="text-sm text-[#004877] hover:text-[#015C99]">
                    ¿Qué pasa si la compra fue legítima?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600">
                    Si confirmas que realizaste la compra, el caso se cierra y la transacción se marca como válida.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-gray-200">
                  <AccordionTrigger className="text-sm text-[#004877] hover:text-[#015C99]">
                    ¿Cuánto tarda un reporte en resolverse?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600">
                    Puede tomar de horas a días.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-gray-200">
                  <AccordionTrigger className="text-sm text-[#004877] hover:text-[#015C99]">
                    ¿Puedo cancelar el reporte?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600">
                    Sí, si aún no fue enviado a revisión del comercio.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-[#F7F8FA] rounded-2xl p-6">
              <h4 className="text-lg text-[#004877] mb-2 text-center">¿Necesitas más ayuda?</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Estamos disponibles 24/7</p>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleChatbot} className="h-12 bg-[#004877] hover:bg-[#015C99] text-white rounded-2xl transition-all shadow-md hover:shadow-lg">
                  <MessageCircle className="size-5 mr-2" /> Chatbot
                </Button>
                <Button
                  onClick={handleHumanSupport}
                  variant="outline"
                  className="h-12 border-2 border-[#004877] text-[#004877] hover:bg-[#004877] hover:text-white rounded-2xl transition-all"
                >
                  <User className="size-5 mr-2" /> Hablar con agente
                </Button>
              </div>
            </div>

            <Button onClick={onClose} variant="outline" className="w-full h-12 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-2xl">
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
