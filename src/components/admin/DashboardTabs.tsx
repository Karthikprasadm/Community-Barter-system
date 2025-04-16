
import React, { Suspense, lazy } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { 
  Database, 
  Users, 
  Package, 
  Activity, 
  BarChart3, 
  FileDown 
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { DatabaseQueryTab } from "./DatabaseQueryTab";
import { UsersTab } from "./UsersTab";
import { ItemsTab } from "./ItemsTab";

const ActivityLog = lazy(() => import('@/components/ui/ActivityLog').then(mod => ({ default: mod.ActivityLog })));
const DataExport = lazy(() => import('@/components/ui/DataExport').then(mod => ({ default: mod.DataExport })));
const AdminCharts = lazy(() => import('@/components/ui/AdminCharts').then(mod => ({ default: mod.AdminCharts })));

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
  showUserEditor,
  showItemEditor,
  handleEditUser,
  handleAddUser,
  handleAddItem,
  handleEditItem,
  handleDeleteUser,
  handleDeleteItem,
  handleUpdateItemStatus,
  handleAddAdmin,
  addUser
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-6 mb-8">
        <TabsTrigger value="database" className="flex items-center gap-2 py-3">
          <Database className="h-4 w-4" /> 
          Database Query
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2 py-3">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="items" className="flex items-center gap-2 py-3">
          <Package className="h-4 w-4" />
          Items
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2 py-3">
          <Activity className="h-4 w-4" />
          Activity Log
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2 py-3">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="export" className="flex items-center gap-2 py-3">
          <FileDown className="h-4 w-4" />
          Data Export
        </TabsTrigger>
      </TabsList>
      
      <AnimatePresence mode="wait">
        <TabsContent value="database" key="database">
          <DatabaseQueryTab 
            users={users} 
            items={items} 
            trades={trades} 
            offers={offers} 
          />
        </TabsContent>
        
        <TabsContent value="users" key="users">
          {!showUserEditor && (
            <UsersTab 
              users={users}
              items={items}
              handleEditUser={handleEditUser}
              handleAddUser={handleAddUser}
              handleDeleteUser={handleDeleteUser}
              handleAddAdmin={handleAddAdmin}
              addUser={addUser}
            />
          )}
        </TabsContent>
        
        <TabsContent value="items" key="items">
          {!showItemEditor && (
            <ItemsTab 
              users={users}
              items={items}
              handleEditItem={handleEditItem}
              handleAddItem={handleAddItem}
              handleDeleteItem={handleDeleteItem}
              handleUpdateItemStatus={handleUpdateItemStatus}
            />
          )}
        </TabsContent>
        
        <TabsContent value="activity" key="activity">
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ActivityLog />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="analytics" key="analytics">
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AdminCharts />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="export" key="export">
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <DataExport />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
};
