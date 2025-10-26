import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Alimentos', value: 4580, color: '#F59E0B' },
  { name: 'Transporte', value: 2340, color: '#10B981' },
  { name: 'Compras', value: 8350, color: '#3B82F6' },
  { name: 'Entretenimiento', value: 1147, color: '#8B5CF6' },
  { name: 'Servicios', value: 856, color: '#EC4899' },
  { name: 'Conveniencia', value: 963, color: '#14B8A6' },
];

export function CategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => `$${value.toLocaleString('es-MX')}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
