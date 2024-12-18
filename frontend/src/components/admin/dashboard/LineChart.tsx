import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material';

const LineCharts = () => {
  const theme = useTheme();

  const data = [
    { month: 'Jan', revenue: 2000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 4500 },
    { month: 'Apr', revenue: 5500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 6500 },
    { month: 'Jul', revenue: 7500 },
    { month: 'Aug', revenue: 2500 },
    { month: 'Sep', revenue: 1500 },
    { month: 'Oct', revenue: 3500 },
    { month: 'Nov', revenue: 5040 },
    { month: 'Dec', revenue: 9500 }
  ];

  const lineColor = theme.palette.mode === 'dark' ? '#8884d8' : '#82ca9d';  // Dynamic color based on theme

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke={lineColor} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineCharts;
