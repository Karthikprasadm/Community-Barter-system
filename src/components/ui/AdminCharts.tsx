
import React from 'react';
import { useBarterContext } from '@/context/BarterContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Import chart components
import { CategoryCharts } from '@/components/charts/CategoryCharts';
import { ActivityCharts } from '@/components/charts/ActivityCharts';
import { ReputationCharts } from '@/components/charts/ReputationCharts';
import { ItemStatusCharts } from '@/components/charts/ItemStatusCharts';
import { UserActivityMetrics } from '@/components/charts/UserActivityMetrics';

// Import data utilities
import { 
  getCategoryData,
  getTradeActivityByMonth,
  getReputationData,
  getItemStatusData,
  getUserActivityMetrics
} from '@/components/charts/ChartDataUtils';

export const AdminCharts = () => {
  const { users, items, trades, offers } = useBarterContext();
  
  // Process data for charts using utility functions
  const categoryData = getCategoryData(items);
  const tradeActivityData = getTradeActivityByMonth(trades, offers);
  const reputationData = getReputationData(users);
  const itemStatusData = getItemStatusData(items);
  const userActivityData = getUserActivityMetrics(users, items, trades);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Platform Analytics</CardTitle>
          <CardDescription>Visual representation of real platform data</CardDescription>
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
              <CategoryCharts categoryData={categoryData} />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityCharts tradeActivityData={tradeActivityData} />
            </TabsContent>
            
            <TabsContent value="reputation">
              <ReputationCharts reputationData={reputationData} />
            </TabsContent>

            <TabsContent value="status">
              <ItemStatusCharts itemStatusData={itemStatusData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Analytics - Using Real Data */}
      <UserActivityMetrics userActivityData={userActivityData} />
    </motion.div>
  );
};

export default AdminCharts;
