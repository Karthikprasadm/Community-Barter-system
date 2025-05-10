import React, { useState } from "react";
import { User, Item, Trade, Offer } from "@/types";
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
  users: User[];
  items: Item[];
  trades: Trade[];
  offers: Offer[];
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
  addUser: (user: User) => void;
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
  handleDeleteUser,
  handleAddAdmin,
  addUser,
  handleEditItem,
  handleAddItem,
  handleDeleteItem,
  handleUpdateItemStatus,
  showUserEditor,
  showItemEditor
}: DashboardTabsProps) => {
  // State for query history (for PerformanceInsightsTab)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

  // Handler for query history updates from DatabaseQueryTab
  const handleQueryHistoryUpdate = (history: QueryHistoryItem[]) => {
    setQueryHistory(history);
  };

// (removed duplicated/erroneous destructuring and implementation)

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
            items={items}
            handleEditUser={handleEditUser}
            handleAddUser={handleAddUser}
            handleDeleteUser={handleDeleteUser}
            handleAddAdmin={handleAddAdmin}
            addUser={addUser}
          />
        </TabsContent>
        
        <TabsContent value="items" className="mt-0">
          <ItemsTab 
            items={items}
            users={users}
            handleAddItem={handleAddItem}
            handleEditItem={handleEditItem}
            handleDeleteItem={handleDeleteItem}
            handleUpdateItemStatus={handleUpdateItemStatus}
          />
        </TabsContent>
        
        <TabsContent value="trades" className="mt-0">
          {/* Show all trades for admin by passing userId={null} */}
          <TradeHistory userId={null} />
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
            queryHistory={queryHistory}
            setQueryHistory={setQueryHistory}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <PerformanceInsightsTab queryHistory={queryHistory} />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <ActivityLog />
        </TabsContent>
      </div>
    </Tabs>
  );
};
