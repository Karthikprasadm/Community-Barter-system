
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

  // Item Status Data
  const itemStatusData = [
    { name: 'Available', value: items.filter(item => item.isAvailable).length },
    { name: 'Traded', value: items.filter(item => !item.isAvailable).length },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8DD1E1', '#A28CFA', '#FF6C6C'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Platform Analytics</CardTitle>
          <CardDescription>Visual representation of platform data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="categories">Item Categories</TabsTrigger>
              <TabsTrigger value="activity">Trading Activity</TabsTrigger>
              <TabsTrigger value="reputation">User Reputation</TabsTrigger>
              <TabsTrigger value="status">Item Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
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
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="bg-white p-4 rounded-md border h-80">
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
              </div>
            </TabsContent>
            
            <TabsContent value="reputation">
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
            </TabsContent>

            <TabsContent value="status">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Activity Metrics</CardTitle>
          <CardDescription>Detailed user engagement statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 bg-white rounded-md border">
            <ChartContainer 
              config={{
                users: { label: "Active Users", color: "#ff9800" },
                items: { label: "Listed Items", color: "#2196f3" },
                trades: { label: "Completed Trades", color: "#4caf50" },
              }}
            >
              <LineChart data={getMonthData().map(d => ({
                month: d.month,
                users: Math.floor(Math.random() * 20) + 5,
                items: Math.floor(Math.random() * 15) + 3,
                trades: d.trades
              }))}>
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
    </motion.div>
  );
};
