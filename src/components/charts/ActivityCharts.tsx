
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
  if (!tradeActivityData || tradeActivityData.every(d => d.trades === 0 && d.offers === 0)) {
    return (
      <div className="bg-white p-4 rounded-md border w-full min-h-[350px] md:min-h-[420px] flex items-center justify-center">
        <span className="text-gray-400">No trading activity data available.</span>
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded-md border w-full mb-10">
      <h3 className="text-md font-medium mb-4">Monthly Trading Activity</h3>
      <ChartContainer 
        config={{
          trades: { label: "Completed Trades", color: "#8884d8" },
          offers: { label: "Offers Made", color: "#82ca9d" },
        }}
      >
        <div className="w-full" style={{ height: 400 }}>
          {(!tradeActivityData || tradeActivityData.every(d => d.trades === 0 && d.offers === 0)) ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-400">No trading activity data available.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
          )}
        </div>
      </ChartContainer>
    </div>
  );
};
