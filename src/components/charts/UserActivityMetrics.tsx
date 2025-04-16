
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Activity Metrics</CardTitle>
        <CardDescription>Detailed user engagement statistics based on actual data</CardDescription>
      </CardHeader>
      <CardContent>
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
              <Line type="monotone" dataKey="users" stroke="#ff9800" />
              <Line type="monotone" dataKey="items" stroke="#2196f3" />
              <Line type="monotone" dataKey="trades" stroke="#4caf50" />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
