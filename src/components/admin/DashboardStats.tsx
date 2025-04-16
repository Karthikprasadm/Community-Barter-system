
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, RefreshCw } from "lucide-react";

type DashboardStatsProps = {
  userCount: number;
  activeItemCount: number;
  tradeCount: number;
};

export const DashboardStats = ({ userCount, activeItemCount, tradeCount }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-blue-100 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-2 bg-blue-50">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <Users className="h-5 w-5 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCount}</p>
            <p className="text-sm text-gray-500">Registered accounts</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-green-100 hover:border-green-200 transition-colors">
          <CardHeader className="pb-2 bg-green-50">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <Package className="h-5 w-5 text-green-500" />
              Active Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeItemCount}</p>
            <p className="text-sm text-gray-500">Items available for trade</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-amber-100 hover:border-amber-200 transition-colors">
          <CardHeader className="pb-2 bg-amber-50">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <RefreshCw className="h-5 w-5 text-amber-500" />
              Completed Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tradeCount}</p>
            <p className="text-sm text-gray-500">Successful exchanges</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
