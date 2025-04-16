
import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8DD1E1', '#A28CFA', '#FF6C6C'];

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryChartsProps {
  categoryData: CategoryData[];
}

export const CategoryCharts = ({ categoryData }: CategoryChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="bg-white p-4 rounded-md border h-80">
        <ChartContainer 
          config={{
            categories: { label: "Item Categories" },
          }}
        >
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="bg-white p-4 rounded-md border h-80">
        <ChartContainer 
          config={{
            value: { label: "Items", color: "#8884d8" },
          }}
        >
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
