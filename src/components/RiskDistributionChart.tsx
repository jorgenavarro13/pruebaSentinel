import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Lun',
    rojo: 1,
    amarillo: 3,
    verde: 12,
  },
  {
    name: 'Mar',
    rojo: 0,
    amarillo: 5,
    verde: 15,
  },
  {
    name: 'Mié',
    rojo: 2,
    amarillo: 4,
    verde: 10,
  },
  {
    name: 'Jue',
    rojo: 0,
    amarillo: 2,
    verde: 18,
  },
  {
    name: 'Vie',
    rojo: 1,
    amarillo: 6,
    verde: 14,
  },
  {
    name: 'Sáb',
    rojo: 0,
    amarillo: 3,
    verde: 8,
  },
  {
    name: 'Dom',
    rojo: 0,
    amarillo: 1,
    verde: 5,
  },
];

export function RiskDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend />
        <Bar dataKey="verde" stackId="a" fill="#10B981" name="Verde" />
        <Bar dataKey="amarillo" stackId="a" fill="#F59E0B" name="Amarillo" />
        <Bar dataKey="rojo" stackId="a" fill="#EF4444" name="Rojo" />
      </BarChart>
    </ResponsiveContainer>
  );
}
