import { ShoppingBag, Tv, Coffee, Car, Package, Store, Zap } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Transaction } from './mockData';

interface TransactionListProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  compactMode?: boolean;
}

const categoryIcons: Record<string, any> = {
  'Compras': ShoppingBag,
  'Entretenimiento': Tv,
  'Alimentos': Coffee,
  'Transporte': Car,
  'Servicios': Zap,
  'Conveniencia': Store,
};

export function TransactionList({ transactions, onSelectTransaction, compactMode = false }: TransactionListProps) {
  const getCardStyle = (level: string) => {
    if (level === 'red') {
      // Tarjetas de alerta con rojo corporativo
      return {
        background: 'bg-gradient-to-b from-[#D22E1E] to-[#B42318]',
        hoverShadow: 'hover:shadow-xl hover:shadow-red-500/20',
        border: 'border-[#D22E1E]',
        iconBg: 'bg-white/20',
        iconColor: 'text-white',
        textColor: 'text-white',
        secondaryText: 'text-white/80',
        badge: { color: 'bg-white/25', label: 'COMPRA SOSPECHOSA', textColor: 'text-white' }
      };
    }
    if (level === 'yellow') {
      // Tarjetas de revisión con amarillo
      return {
        background: 'bg-gradient-to-b from-[#F59E0B] to-[#D97706]',
        hoverShadow: 'hover:shadow-xl hover:shadow-yellow-500/20',
        border: 'border-[#F59E0B]',
        iconBg: 'bg-white/20',
        iconColor: 'text-white',
        textColor: 'text-white',
        secondaryText: 'text-white/80',
        badge: { color: 'bg-white/25', label: 'GASTO HORMIGA', textColor: 'text-white' }
      };
    }
    // Tarjetas normales con azul corporativo Capital One
    return {
      background: 'bg-gradient-to-b from-[#004877] to-[#015C99]',
      hoverShadow: 'hover:shadow-xl hover:shadow-blue-900/30',
      border: 'border-[#004877]',
      iconBg: 'bg-white/15',
      iconColor: 'text-white',
      textColor: 'text-white',
      secondaryText: 'text-white/75',
      badge: { color: 'bg-white/20', label: 'NORMAL', textColor: 'text-white' }
    };
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200">
        No se encontraron transacciones
      </div>
    );
  }

  const padding = compactMode ? 'p-3' : 'p-5';
  const spacing = compactMode ? 'space-y-1' : 'space-y-3';
  const iconSize = compactMode ? 'size-5' : 'size-12';
  const iconInnerSize = compactMode ? 'size-2' : 'size-6';

  return (
    <div className={spacing}>
      {transactions.map((transaction) => {
        const Icon = categoryIcons[transaction.category] || Package;
        const cardStyle = getCardStyle(transaction.riskLevel);

        return (
          <div
            key={transaction.id}
            onClick={() => onSelectTransaction(transaction)}
            className={`flex items-center gap-4 ${padding} ${cardStyle.background} rounded-2xl ${cardStyle.hoverShadow} cursor-pointer transition-all border ${cardStyle.border} shadow-md`}
          >
            {/* Icon */}
            <div className={`${iconSize} rounded-xl ${cardStyle.iconBg} flex items-center justify-center backdrop-blur-sm`}>
              <Icon className={`${iconInnerSize} ${cardStyle.iconColor}`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`${cardStyle.textColor} ${compactMode ? 'mb-0.5' : 'mb-1'} truncate`}>
                {transaction.merchant}
              </h4>
              <div className={`flex items-center gap-3 text-xs ${cardStyle.secondaryText}`}>
                <span>{transaction.date}</span>
                <span>•</span>
                <span>{transaction.time}</span>
                <span>•</span>
                <span>{transaction.category}</span>
              </div>
            </div>

            {/* Amount and Badge */}
            <div className="text-right">
              <div className={`${cardStyle.textColor} ${compactMode ? 'mb-1.5' : 'mb-2'}`}>
                ${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <Badge
                variant="outline"
                className={`${cardStyle.badge.color} ${cardStyle.badge.textColor} border-none text-xs px-3 py-1 backdrop-blur-sm`}
              >
                {cardStyle.badge.label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
