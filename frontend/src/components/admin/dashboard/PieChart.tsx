import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

const data = [
  { name: 'Economy Cars', value: 400 },
  { name: 'Luxury Cars', value: 300 },
  { name: 'SUVs', value: 300 },
  { name: 'Convertibles', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieCharts = () => {
  const theme = useTheme();
  return (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill={theme.palette.primary?.main}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${new Intl.NumberFormat('en-US').format(value as number)} units`} />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
  );
};

export default PieCharts;
