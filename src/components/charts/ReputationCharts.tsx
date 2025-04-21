
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
  if (!reputationData || reputationData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md border w-full min-h-[350px] md:min-h-[420px] flex items-center justify-center">
        <span className="text-gray-400">No user reputation data available.</span>
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded-md border w-full mb-10 flex flex-col h-[460px] justify-center items-center">
      <h3 className="text-md font-medium mb-4 self-start">User Reputation Distribution</h3>
      <ChartContainer 
        config={{
          value: { label: "Users", color: "#8884d8" },
        }}
      >
        <div className="flex-1 w-full flex items-center justify-center" style={{ height: 400 }}>
          {(!reputationData || reputationData.length === 0) ? (
            <div className="flex justify-center items-center h-full w-full">
              <span className="text-gray-400">No user reputation data available.</span>
            </div>
          ) : (
            <ResponsiveContainer width="95%" height="100%">
              <BarChart data={reputationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartContainer>
    </div>
  );
};
