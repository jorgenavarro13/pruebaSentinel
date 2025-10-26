import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { TransactionList } from './TransactionList';
import { AlertDetailModal } from './AlertDetailModal';
import { transactions, type Transaction } from './mockData';

export function Dashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  const accountBalance = 24567.89;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gradient-to-br from-[#004877] to-[#015C99] rounded-lg flex items-center justify-center shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-[#004877]">Capital One</h1>
                <p className="text-xs text-gray-500">Sentinel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCompactMode(!compactMode)}
                className="text-sm px-3 py-1.5 rounded-lg bg-[#E6EEF5] text-[#004877] hover:bg-[#004877] hover:text-white transition-colors"
              >
                {compactMode ? 'Vista normal' : 'Vista compacta'}
              </button>
              <button className="text-sm text-[#004877] hover:underline">
                Ayuda
              </button>
              <button className="text-sm text-[#004877] hover:underline">
                Perfil
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Balance Section - Centered */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">Saldo disponible</p>
          <p className="text-5xl text-[#004877] mb-1">
            ${accountBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400">Actualizado en tiempo real</p>
        </div>

        {/* Transactions Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-[#004877] mb-1">Actividad reciente</h2>
            <p className="text-sm text-gray-500">Tus últimas transacciones</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-gradient-to-b from-[#004877] to-[#015C99]"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706]"></div>
              <span>Revisar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-gradient-to-b from-[#D22E1E] to-[#B42318]"></div>
              <span>Alerta</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <TransactionList
            transactions={transactions}
            onSelectTransaction={setSelectedTransaction}
            compactMode={compactMode}
          />
        </div>
      </main>

      {/* Alert Detail Modal */}
      {selectedTransaction && (
        <AlertDetailModal
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
