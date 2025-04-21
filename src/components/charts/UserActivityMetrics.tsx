
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
    <div className="w-full px-0 py-6 rounded-lg border bg-white shadow">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg">User Activity Metrics</CardTitle>
          <CardDescription>Detailed user engagement statistics based on actual data</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="min-h-[350px] md:min-h-[420px] w-full bg-white rounded-md border overflow-x-auto flex items-center justify-center">
            <div className="w-full">
              <ChartContainer 
                config={{
                  users: { label: "New Users", color: "#ff9800" },
                  items: { label: "Listed Items", color: "#2196f3" },
                  trades: { label: "Completed Trades", color: "#4caf50" },
                }}
              >
                <LineChart data={userActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} width={600} height={320}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
