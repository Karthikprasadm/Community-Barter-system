
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ReputationData {
  name: string;
  value: number;
}

interface ReputationChartsProps {
  reputationData: ReputationData[];
}

export const ReputationCharts = ({ reputationData }: ReputationChartsProps) => {
  return (
    <div className="bg-white p-4 rounded-md border h-80">
      <h3 className="text-md font-medium mb-4">User Reputation Distribution</h3>
      <ChartContainer 
        config={{
          value: { label: "Users", color: "#8884d8" },
        }}
      >
        <BarChart data={reputationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
