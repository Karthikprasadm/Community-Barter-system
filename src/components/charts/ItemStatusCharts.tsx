import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ItemStatusData {
  name: string;
  value: number;
}

interface ItemStatusChartsProps {
  itemStatusData: ItemStatusData[];
}

export const ItemStatusCharts = ({ itemStatusData }: ItemStatusChartsProps) => {
  if (!itemStatusData || itemStatusData.every(d => d.value === 0)) {
    return (
      <div className="bg-white p-4 rounded-md border w-full min-h-[350px] md:min-h-[420px] flex items-center justify-center">
        <span className="text-gray-400">No item status data available.</span>
      </div>
    );
  }
  if (!itemStatusData || itemStatusData.every(d => d.value === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white p-4 rounded-md border w-full mb-10">
          <div className="w-full" style={{ height: 400 }}>
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-400">No item status data available.</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md border w-full mb-10">
          <div className="w-full" style={{ height: 400 }}>
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-400">No item status data available.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="bg-white p-4 rounded-md border w-full mb-10">
        <ChartContainer 
          config={{
            status: { label: "Item Status" },
          }}
        >
          <div className="w-full" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
      <div className="bg-white p-4 rounded-md border w-full mb-10">
        <ChartContainer 
          config={{
            value: { label: "Count", color: "#3f51b5" },
          }}
        >
          <div className="w-full" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="#3f51b5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
