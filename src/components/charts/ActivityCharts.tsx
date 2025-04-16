
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TradeActivity {
  month: string;
  trades: number;
  offers: number;
}

interface ActivityChartsProps {
  tradeActivityData: TradeActivity[];
}

export const ActivityCharts = ({ tradeActivityData }: ActivityChartsProps) => {
  return (
    <div className="bg-white p-4 rounded-md border h-80">
      <h3 className="text-md font-medium mb-4">Monthly Trading Activity</h3>
      <ChartContainer 
        config={{
          trades: { label: "Completed Trades", color: "#8884d8" },
          offers: { label: "Offers Made", color: "#82ca9d" },
        }}
      >
        <LineChart data={tradeActivityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="trades" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="offers" 
            stroke="#82ca9d" 
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
