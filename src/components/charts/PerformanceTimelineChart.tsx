
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceData {
  name: string;
  time: number;
  rows?: number;
}

interface PerformanceTimelineChartProps {
  performanceData: PerformanceData[];
  title: string;
  description?: string;
}

export const PerformanceTimelineChart = ({ performanceData, title, description }: PerformanceTimelineChartProps) => {
  return (
    <div className="bg-white p-4 rounded-md border h-80">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      <ChartContainer 
        config={{
          time: { label: "Execution Time (ms)", color: "#8884d8" },
          rows: { label: "Rows Returned", color: "#82ca9d" },
        }}
      >
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="time" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          {performanceData[0]?.rows !== undefined && (
            <Line 
              type="monotone" 
              dataKey="rows" 
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};
