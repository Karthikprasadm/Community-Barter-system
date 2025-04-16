
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./UsersTab";
import { ItemsTab } from "./ItemsTab";
import { TradeHistory } from "@/components/ui/TradeHistory";
import { AdminCharts } from "@/components/ui/AdminCharts";
import { DatabaseQueryTab, QueryHistoryItem } from "./DatabaseQueryTab";
import { PerformanceInsightsTab } from "./PerformanceInsightsTab";
import { DataExport } from "@/components/ui/DataExport";
import { ActivityLog } from "@/components/ui/ActivityLog";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: any[];
  items: any[];
  trades: any[];
  offers: any[];
  showUserEditor: boolean;
  showItemEditor: boolean;
  handleEditUser: (userId: string) => void;
  handleAddUser: () => void;
  handleAddItem: () => void;
  handleEditItem: (itemId: string) => void;
  handleDeleteUser: (userId: string) => void;
  handleDeleteItem: (itemId: string) => void;
  handleUpdateItemStatus: (itemId: string, status: boolean) => void;
  handleAddAdmin: () => void;
  addUser: (user: any) => void;
}

export const DashboardTabs = ({
  activeTab,
  setActiveTab,
  users,
  items,
  trades,
  offers,
  handleEditUser,
  handleAddUser,
  handleAddItem,
  handleEditItem,
  handleDeleteUser,
  handleDeleteItem,
  handleUpdateItemStatus,
  handleAddAdmin,
}: DashboardTabsProps) => {
  // State for query history
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  
  // This effect syncs the queryHistory from DatabaseQueryTab
  const handleQueryHistoryUpdate = (history: QueryHistoryItem[]) => {
    setQueryHistory(history);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="trades">Trades</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="database">Database</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="activity">Activity Log</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="users" className="mt-0">
          <UsersTab 
            users={users} 
            onEditUser={handleEditUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onAddAdmin={handleAddAdmin}
          />
        </TabsContent>
        
        <TabsContent value="items" className="mt-0">
          <ItemsTab 
            items={items}
            users={users}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onUpdateStatus={handleUpdateItemStatus}
          />
        </TabsContent>
        
        <TabsContent value="trades" className="mt-0">
          <TradeHistory trades={trades} offers={offers} users={users} />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <AdminCharts />
        </TabsContent>
        
        <TabsContent value="database" className="mt-0">
          <DatabaseQueryTab 
            users={users} 
            items={items} 
            trades={trades} 
            offers={offers}
            onUpdateQueryHistory={handleQueryHistoryUpdate}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <PerformanceInsightsTab queryHistory={queryHistory} />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <ActivityLog users={users} items={items} trades={trades} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
