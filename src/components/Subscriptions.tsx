import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pause, X, TrendingDown, History, DollarSign } from 'lucide-react';
import { subscriptions } from './mockData';
import { toast } from 'sonner@2.0.3';

export function Subscriptions() {
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const unusedSubs = subscriptions.filter(s => s.badge === 'unused');
  const potentialSavings = unusedSubs.reduce((sum, sub) => sum + sub.amount, 0);

  const getBadgeInfo = (badge?: string) => {
    if (badge === 'frequent') return { label: 'Uso frecuente', color: 'bg-[#10B981]' };
    if (badge === 'unused') return { label: 'Sin uso detectado 60 días', color: 'bg-[#F59E0B]' };
    if (badge === 'duplicate') return { label: 'Duplicado potencial', color: 'bg-[#EF4444]' };
    return null;
  };

  const handlePause = (merchant: string) => {
    toast.info(`Pausando suscripción de ${merchant}...`);
  };

  const handleCancel = (merchant: string) => {
    toast.success(`Solicitud de cancelación enviada para ${merchant}`);
  };

  const handleNegotiate = (merchant: string) => {
    toast.info(`Abriendo negociación de precio con ${merchant}...`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Suscripciones</h1>
        <p className="text-gray-400">Gestiona tus cobros recurrentes y optimiza tu gasto mensual</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111827] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Gasto mensual total</p>
                <p className="text-3xl">${totalMonthly.toLocaleString('es-MX')}</p>
              </div>
              <DollarSign className="size-12 text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Suscripciones activas</p>
                <p className="text-3xl">{subscriptions.length}</p>
              </div>
              <div className="size-12 rounded-full bg-blue-600/20 flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 border-[#F59E0B]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Ahorro potencial</p>
                <p className="text-3xl">${potentialSavings.toLocaleString('es-MX')}/mes</p>
                <p className="text-xs text-gray-400 mt-1">si cancelas {unusedSubs.length} suscripciones sin uso</p>
              </div>
              <TrendingDown className="size-12 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card className="bg-[#111827] border-gray-800">
        <CardHeader>
          <CardTitle>Todas tus suscripciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const badgeInfo = getBadgeInfo(sub.badge);

              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 p-5 bg-[#0F172A] rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {/* Logo */}
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl">
                    {sub.logo}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg">{sub.merchant}</h4>
                      {badgeInfo && (
                        <Badge className={`${badgeInfo.color} border-none text-xs`}>
                          {badgeInfo.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{sub.frequency} • ${sub.amount}</span>
                      <span>•</span>
                      <span>Próximo cobro: {sub.nextCharge}</span>
                      {sub.lastUsed && (
                        <>
                          <span>•</span>
                          <span>Último uso: {sub.lastUsed}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right mr-4">
                    <div className="text-xl mb-1">
                      ${sub.monthlyAverage.toLocaleString('es-MX')}
                    </div>
                    <div className="text-xs text-gray-400">por mes</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-700"
                      onClick={() => handlePause(sub.merchant)}
                    >
                      <Pause className="size-4 mr-1" />
                      Pausar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-700"
                      onClick={() => handleNegotiate(sub.merchant)}
                    >
                      <DollarSign className="size-4 mr-1" />
                      Negociar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-gray-700"
                      onClick={() => handleCancel(sub.merchant)}
                    >
                      <X className="size-4 mr-1" />
                      Cancelar
                    </Button>
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
