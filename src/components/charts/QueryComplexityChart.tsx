
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ComplexityData {
  name: string;
  avgTime: number;
  count: number;
}

interface QueryComplexityChartProps {
  complexityData: ComplexityData[];
  title: string;
  description?: string;
}

export const QueryComplexityChart = ({ complexityData, title, description }: QueryComplexityChartProps) => {
  return (
    <div className="bg-white p-4 rounded-md border h-80">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      <ChartContainer 
        config={{
          avgTime: { label: "Average Time (ms)", color: "#8884d8" },
          count: { label: "Query Count", color: "#82ca9d" },
        }}
      >
        <BarChart data={complexityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="avgTime" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
