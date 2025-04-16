
import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ItemStatusData {
  name: string;
  value: number;
}

interface ItemStatusChartsProps {
  itemStatusData: ItemStatusData[];
}

export const ItemStatusCharts = ({ itemStatusData }: ItemStatusChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="bg-white p-4 rounded-md border h-80">
        <ChartContainer 
          config={{
            status: { label: "Item Status" },
          }}
        >
          <PieChart>
            <Pie
              data={itemStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              <Cell fill="#4CAF50" />
              <Cell fill="#F44336" />
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="bg-white p-4 rounded-md border h-80">
        <ChartContainer 
          config={{
            value: { label: "Count", color: "#3f51b5" },
          }}
        >
          <BarChart data={itemStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="value" fill="#3f51b5" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
