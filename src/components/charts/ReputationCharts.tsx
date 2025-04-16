
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
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
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
