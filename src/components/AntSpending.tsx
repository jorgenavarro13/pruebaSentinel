import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { TrendingUp, PiggyBank, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { antSpending } from './mockData';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

const trendData = [
  { month: 'Ago', total: 5234 },
  { month: 'Sep', total: 5892 },
  { month: 'Oct', total: 6023 },
];

export function AntSpending() {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const totalMonthly = antSpending.reduce((sum, item) => sum + item.monthlyTotal, 0);
  const totalYearly = antSpending.reduce((sum, item) => sum + item.yearlyProjection, 0);
  const savingsIfReduced30 = totalMonthly * 0.3;

  const handleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    if (enabled) {
      toast.success('Auto-ahorro activado. Se guardará el 30% de tus compras hormiga.');
    } else {
      toast.info('Auto-ahorro desactivado.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Gastos hormiga</h1>
        <p className="text-gray-400">Identifica pequeñas fugas que impactan tu bolsillo a largo plazo</p>
      </div>

      {/* Nudge Card */}
      <Card className="bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 border-[#F59E0B] mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-xl mb-2 flex items-center gap-2">
                <PiggyBank className="size-6 text-[#F59E0B]" />
                Oportunidad de ahorro
              </h3>
              <p className="text-gray-300 mb-4">
                Llevas <span className="text-[#F59E0B]">${totalMonthly.toLocaleString('es-MX')}</span> este mes en gastos hormiga.
                Si reduces un 30%, ahorrarías <span className="text-[#10B981]">${savingsIfReduced30.toLocaleString('es-MX')}/mes</span>.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoSaveEnabled}
                    onCheckedChange={handleAutoSave}
                  />
                  <span>Auto-ahorro por compra hormiga (30%)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Proyección anual</div>
              <div className="text-3xl text-[#EF4444]">
                ${totalYearly.toLocaleString('es-MX')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <Card className="bg-[#111827] border-gray-800 col-span-2">
          <CardHeader>
            <CardTitle>Tendencia de gastos hormiga</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString('es-MX')}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-400 mt-4 text-center">
              <TrendingUp className="inline size-4 text-[#EF4444] mr-1" />
              Incremento del 15% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle>Resumen mensual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#0F172A] rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Total este mes</p>
              <p className="text-2xl">${totalMonthly.toLocaleString('es-MX')}</p>
            </div>
            <div className="p-4 bg-[#0F172A] rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Transacciones</p>
              <p className="text-2xl">{antSpending.reduce((sum, item) => sum + item.frequency, 0)}</p>
            </div>
            <div className="p-4 bg-[#0F172A] rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Promedio por compra</p>
              <p className="text-2xl">
                ${Math.round(totalMonthly / antSpending.reduce((sum, item) => sum + item.frequency, 0)).toLocaleString('es-MX')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Categories */}
      <Card className="bg-[#111827] border-gray-800">
        <CardHeader>
          <CardTitle>Top fugas por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {antSpending.map((item, idx) => {
              const avgPerTransaction = item.monthlyTotal / item.frequency;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-[#0F172A] rounded-xl"
                >
                  {/* Rank */}
                  <div className="size-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
                    #{idx + 1}
                  </div>

                  {/* Icon */}
                  <div className="size-14 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="mb-2">{item.category}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{item.frequency} transacciones</span>
                      <span>•</span>
                      <span>~${Math.round(avgPerTransaction)} promedio</span>
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="text-right mr-6">
                    <div className="text-sm text-gray-400 mb-1">Mensual</div>
                    <div className="text-xl text-[#F59E0B]">
                      ${item.monthlyTotal.toLocaleString('es-MX')}
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="text-right mr-6">
                    <div className="text-sm text-gray-400 mb-1">Proyección anual</div>
                    <div className="text-xl">
                      ${item.yearlyProjection.toLocaleString('es-MX')}
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="text-center px-4 py-2 bg-[#10B981]/20 rounded-xl border border-[#10B981]/30">
                    <div className="text-xs text-gray-400 mb-1">Ahorro 30%</div>
                    <div className="text-sm text-[#10B981]">
                      ${Math.round(item.monthlyTotal * 0.3).toLocaleString('es-MX')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
