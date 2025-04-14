
import React from 'react';
import { useBarterContext } from '@/context/BarterContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

export const AdminCharts = () => {
  const { users, items, trades, offers } = useBarterContext();
  
  // Calculate data for charts
  const categoryCounts = items.reduce((acc, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Trading activity over time (mocked data based on trading months)
  const getMonthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      // Generate some mock data that looks realistic
      const tradesCount = Math.floor(Math.random() * 10) + 1;
      const offersCount = Math.floor(Math.random() * 15) + 5;
      
      return {
        month,
        trades: tradesCount,
        offers: offersCount,
      };
    });
  };
  
  const tradeActivityData = getMonthData();
  
  // User reputation distribution
  const reputationData = [
    { name: 'Excellent (4.5-5)', value: users.filter(u => u.reputation >= 4.5).length },
    { name: 'Good (3.5-4.5)', value: users.filter(u => u.reputation >= 3.5 && u.reputation < 4.5).length },
    { name: 'Average (2.5-3.5)', value: users.filter(u => u.reputation >= 2.5 && u.reputation < 3.5).length },
    { name: 'Fair (1.5-2.5)', value: users.filter(u => u.reputation >= 1.5 && u.reputation < 2.5).length },
    { name: 'Poor (0-1.5)', value: users.filter(u => u.reputation < 1.5).length },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8DD1E1', '#A28CFA', '#FF6C6C'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Platform Analytics</CardTitle>
          <CardDescription>Visual representation of platform data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="categories">Item Categories</TabsTrigger>
              <TabsTrigger value="activity">Trading Activity</TabsTrigger>
              <TabsTrigger value="reputation">User Reputation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="h-80">
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
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="activity" className="h-80">
              <ChartContainer 
                config={{
                  trades: { label: "Completed Trades", color: "#8884d8" },
                  offers: { label: "Offers Made", color: "#82ca9d" },
                }}
              >
                <LineChart data={tradeActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="trades" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="offers" stroke="#82ca9d" />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="reputation" className="h-80">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
