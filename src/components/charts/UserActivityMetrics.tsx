
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ActivityMetric {
  month: string;
  users: number;
  items: number;
  trades: number;
}

interface UserActivityMetricsProps {
  userActivityData: ActivityMetric[];
}

export const UserActivityMetrics = ({ userActivityData }: UserActivityMetricsProps) => {
  // Calculate totals for summary
  const totals = userActivityData.reduce((acc, curr) => {
    return {
      users: acc.users + curr.users,
      items: acc.items + curr.items,
      trades: acc.trades + curr.trades
    };
  }, { users: 0, items: 0, trades: 0 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Activity Metrics</CardTitle>
        <CardDescription>Detailed user engagement statistics based on actual data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-orange-50 rounded-md border border-orange-100">
            <p className="text-sm text-orange-700">New Users</p>
            <p className="text-2xl font-bold text-orange-800">{totals.users}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-700">Listed Items</p>
            <p className="text-2xl font-bold text-blue-800">{totals.items}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-green-700">Completed Trades</p>
            <p className="text-2xl font-bold text-green-800">{totals.trades}</p>
          </div>
        </div>
        
        <div className="h-60 bg-white rounded-md border">
          <ChartContainer 
            config={{
              users: { label: "New Users", color: "#ff9800" },
              items: { label: "Listed Items", color: "#2196f3" },
              trades: { label: "Completed Trades", color: "#4caf50" },
            }}
          >
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#ff9800" strokeWidth={2} />
              <Line type="monotone" dataKey="items" stroke="#2196f3" strokeWidth={2} />
              <Line type="monotone" dataKey="trades" stroke="#4caf50" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
