import React from 'react';
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useTheme } from '@mui/material';

const BarCharts = () => {
  const theme = useTheme();
  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d']; // Define your color array

  const data = [
    { month: 'Jan', revenue: 4000, color: '#8884d8' },
    { month: 'Feb', revenue: 3000, color: '#83a6ed' },
    { month: 'Mar', revenue: 5000, color: '#8dd1e1' },
    { month: 'Apr', revenue: 7000, color: '#82ca9d' },
    // Add other months as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" label={true}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarCharts;
