
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";

type DashboardStatsProps = {
  userCount: number;
  activeItemCount: number;
  tradeCount: number;
  userChange: number;
  itemChange: number;
  tradeChange: number;
};

export const DashboardStats = ({ userCount, activeItemCount, tradeCount, userChange, itemChange, tradeChange }: DashboardStatsProps) => {
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
            <div className="flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> {userChange}%
              </span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
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
            <div className="flex items-center text-sm">
              {itemChange >= 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> {itemChange}%
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(itemChange)}%
                </span>
              )}
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
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
            <div className="flex items-center text-sm">
              {tradeChange >= 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> {tradeChange}%
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(tradeChange)}%
                </span>
              )}
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
