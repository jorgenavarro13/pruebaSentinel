export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  riskLevel: 'red' | 'yellow' | 'green';
  location?: string;
  coordinates?: { lat: number; lng: number };
  riskReasons?: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  isRecurring?: boolean;
}

export interface Subscription {
  id: string;
  merchant: string;
  logo: string;
  amount: number;
  frequency: string;
  nextCharge: string;
  monthlyAverage: number;
  lastUsed?: string;
  badge?: 'frequent' | 'unused' | 'duplicate';
}

export interface AntSpend {
  category: string;
  monthlyTotal: number;
  frequency: number;
  yearlyProjection: number;
  icon: string;
}

export const transactions: Transaction[] = [
  {
    id: '1',
    merchant: 'AliExpress',
    amount: 4250.00,
    date: '25 Oct 2025',
    time: '03:42 AM',
    category: 'Compras',
    riskLevel: 'red',
    location: 'Shanghai, China',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    riskReasons: [
      {
        title: 'Geo-velocidad imposible',
        description: 'Tu última transacción fue en CDMX hace 2 horas. Es imposible estar en Shanghai.',
        severity: 'high',
      },
      {
        title: 'Hora inusual',
        description: 'Detectamos actividad a las 3:42 AM, fuera de tu patrón habitual (9 AM - 11 PM).',
        severity: 'high',
      },
      {
        title: 'Merchant nuevo',
        description: 'Primera vez que compras en este comercio.',
        severity: 'medium',
      },
    ],
  },
  {
    id: '2',
    merchant: 'Netflix Premium',
    amount: 299.00,
    date: '24 Oct 2025',
    time: '08:15 AM',
    category: 'Entretenimiento',
    riskLevel: 'yellow',
    location: 'Ciudad de México',
    isRecurring: true,
    riskReasons: [
     
      {
        title: 'Suscripción recurrente',
        description: 'Cobro mensual automático. Considera si aún lo utilizas.',
        severity: 'low',
      },
    ],
  },
  {
    id: '3',
    merchant: 'Starbucks Polanco',
    amount: 145.00,
    date: '24 Oct 2025',
    time: '07:30 AM',
    category: 'Alimentos',
    riskLevel: 'yellow',
    location: 'Polanco, CDMX',
    riskReasons: [
      {
        title: 'Gasto hormiga',
        description: 'Llevas $1,740 este mes en cafeterías. 12 visitas.',
        severity: 'medium',
      },
    ],
  },
  {
    id: '4',
    merchant: 'Uber 4 viajes',
    amount: 387.50,
    date: '23 Oct 2025',
    time: '11:45 PM',
    category: 'Transporte',
    riskLevel: 'green',
    location: 'Ciudad de México',
  },
  {
    id: '5',
    merchant: 'Amazon México',
    amount: 1250.00,
    date: '23 Oct 2025',
    time: '02:30 PM',
    category: 'Compras',
    riskLevel: 'green',
    location: 'Ciudad de México',
  },
  {
    id: '6',
    merchant: 'Oxxo #4521',
    amount: 67.00,
    date: '23 Oct 2025',
    time: '09:15 AM',
    category: 'Conveniencia',
    riskLevel: 'yellow',
    location: 'Roma Norte, CDMX',
    riskReasons: [
      {
        title: 'Gasto hormiga',
        description: 'Compras frecuentes en tiendas de conveniencia. 8 este mes.',
        severity: 'low',
      },
    ],
  },
  {
    id: '7',
    merchant: 'CFE Pago de luz',
    amount: 856.00,
    date: '22 Oct 2025',
    time: '10:00 AM',
    category: 'Servicios',
    riskLevel: 'green',
    location: 'Ciudad de México',
    isRecurring: true,
  },
  {
    id: '8',
    merchant: 'Spotify Premium',
    amount: 115.00,
    date: '22 Oct 2025',
    time: '08:00 AM',
    category: 'Entretenimiento',
    riskLevel: 'green',
    location: 'Ciudad de México',
    isRecurring: true,
  },
  {
    id: '9',
    merchant: 'Rappi 2 pedidos',
    amount: 456.00,
    date: '21 Oct 2025',
    time: '08:30 PM',
    category: 'Alimentos',
    riskLevel: 'yellow',
    location: 'Ciudad de México',
    riskReasons: [
      {
        title: 'Delivery frecuente',
        description: '$2,340 en apps de delivery este mes. Considera cocinar más seguido.',
        severity: 'medium',
      },
    ],
  },
  {
    id: '10',
    merchant: 'Liverpool Insurgentes',
    amount: 2850.00,
    date: '20 Oct 2025',
    time: '05:45 PM',
    category: 'Compras',
    riskLevel: 'green',
    location: 'Insurgentes, CDMX',
  },
];

export const subscriptions: Subscription[] = [
  {
    id: 's1',
    merchant: 'Netflix Premium',
    logo: '🎬',
    amount: 299,
    frequency: 'Mensual',
    nextCharge: '24 Nov 2025',
    monthlyAverage: 299,
    lastUsed: '24 Ago 2025',
    badge: 'unused',
  },
  {
    id: 's2',
    merchant: 'Spotify Premium',
    logo: '🎵',
    amount: 115,
    frequency: 'Mensual',
    nextCharge: '22 Nov 2025',
    monthlyAverage: 115,
    lastUsed: '25 Oct 2025',
    badge: 'frequent',
  },
  {
    id: 's3',
    merchant: 'Adobe Creative Cloud',
    logo: '🎨',
    amount: 649,
    frequency: 'Mensual',
    nextCharge: '15 Nov 2025',
    monthlyAverage: 649,
    lastUsed: '20 Oct 2025',
    badge: 'frequent',
  },
  {
    id: 's4',
    merchant: 'Disney+ Premium',
    logo: '🏰',
    amount: 199,
    frequency: 'Mensual',
    nextCharge: '18 Nov 2025',
    monthlyAverage: 199,
    lastUsed: '10 Sep 2025',
    badge: 'unused',
  },
  {
    id: 's5',
    merchant: 'HBO Max',
    logo: '📺',
    amount: 149,
    frequency: 'Mensual',
    nextCharge: '12 Nov 2025',
    monthlyAverage: 149,
    lastUsed: '22 Oct 2025',
  },
  {
    id: 's6',
    merchant: 'Amazon Prime',
    logo: '📦',
    amount: 99,
    frequency: 'Mensual',
    nextCharge: '05 Nov 2025',
    monthlyAverage: 99,
    lastUsed: '23 Oct 2025',
    badge: 'frequent',
  },
  {
    id: 's7',
    merchant: 'Canva Pro',
    logo: '✨',
    amount: 119,
    frequency: 'Mensual',
    nextCharge: '28 Nov 2025',
    monthlyAverage: 119,
    badge: 'duplicate',
  },
];

export const antSpending: AntSpend[] = [
  {
    category: 'Cafeterías',
    monthlyTotal: 1740,
    frequency: 12,
    yearlyProjection: 20880,
    icon: '☕',
  },
  {
    category: 'Apps de delivery',
    monthlyTotal: 2340,
    frequency: 18,
    yearlyProjection: 28080,
    icon: '🍔',
  },
  {
    category: 'Tiendas de conveniencia',
    monthlyTotal: 896,
    frequency: 8,
    yearlyProjection: 10752,
    icon: '🏪',
  },
  {
    category: 'Snacks y dulces',
    monthlyTotal: 567,
    frequency: 14,
    yearlyProjection: 6804,
    icon: '🍫',
  },
  {
    category: 'Propinas digitales',
    monthlyTotal: 423,
    frequency: 9,
    yearlyProjection: 5076,
    icon: '💰',
  },
];
