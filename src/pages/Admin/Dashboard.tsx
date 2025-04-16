
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useBarterContext } from "@/context/BarterContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

// Import refactored dashboard components
import { DashboardStats } from "@/components/admin/DashboardStats";
import { DashboardTabs } from "@/components/admin/DashboardTabs";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";

const UserEditor = lazy(() => import('@/components/ui/UserEditor').then(mod => ({ default: mod.UserEditor })));
const ItemEditor = lazy(() => import('@/components/ui/ItemEditor').then(mod => ({ default: mod.ItemEditor })));
const AdminUserEditor = lazy(() => import('@/components/ui/AdminUserEditor').then(mod => ({ default: mod.AdminUserEditor })));

const AdminDashboard = () => {
  const { isAdmin, isHeadAdmin, users, items, trades, offers, addUser, deleteUser, updateItem, deleteItem } = useBarterContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [showAdminEditor, setShowAdminEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("database");
  const { toast } = useToast();
  
  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isLoading && activeTab === 'database') {
      // Initial query execution is now handled within the DatabaseQueryTab component
    }
  }, [isLoading, activeTab]);

  if (!isAdmin) {
    return null;
  }
  
  const userToEdit = editingUser ? users.find(u => u.id === editingUser) : undefined;
  const itemToEdit = editingItem ? items.find(i => i.id === editingItem) : undefined;
  
  const handleEditUser = (userId: string) => {
    setEditingUser(userId);
    setShowUserEditor(true);
  };
  
  const handleEditItem = (itemId: string) => {
    setEditingItem(itemId);
    setShowItemEditor(true);
  };
  
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserEditor(true);
  };
  
  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemEditor(true);
  };
  
  const handleUserSaved = () => {
    setShowUserEditor(false);
    setEditingUser(null);
  };
  
  const handleItemSaved = () => {
    setShowItemEditor(false);
    setEditingItem(null);
  };
  
  const handleAddAdmin = () => {
    setShowAdminEditor(true);
  };
  
  const handleAdminSaved = () => {
    setShowAdminEditor(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUser(userId);
      toast({
        title: "User deleted",
        description: "The user has been removed from the system",
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      deleteItem(itemId);
      toast({
        title: "Item deleted",
        description: "The item has been removed from the marketplace",
      });
    }
  };

  const handleUpdateItemStatus = (itemId: string, status: boolean) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem({
        ...item,
        isAvailable: status
      });
      toast({
        title: "Item status updated",
        description: `Item is now ${status ? 'available' : 'unavailable'}`,
      });
    }
  };

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-purple-600" />
              Admin Dashboard
              {isHeadAdmin && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Head Admin
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Manage all aspects of the BarterNexus platform</p>
          </div>
          
          <Button size="sm" variant="outline" className="gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        <DashboardStats 
          userCount={users.length} 
          activeItemCount={items.filter(item => item.isAvailable).length} 
          tradeCount={trades.length} 
        />
        
        {showUserEditor ? (
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <UserEditor 
                user={userToEdit} 
                onClose={() => setShowUserEditor(false)} 
                onSave={handleUserSaved}
              />
            </Suspense>
          </ErrorBoundary>
        ) : showItemEditor ? (
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ItemEditor 
                item={itemToEdit} 
                onClose={() => setShowItemEditor(false)} 
                onSave={handleItemSaved}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <DashboardTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            users={users}
            items={items}
            trades={trades}
            offers={offers}
            showUserEditor={showUserEditor}
            showItemEditor={showItemEditor}
            handleEditUser={handleEditUser}
            handleAddUser={handleAddUser}
            handleAddItem={handleAddItem}
            handleEditItem={handleEditItem}
            handleDeleteUser={handleDeleteUser}
            handleDeleteItem={handleDeleteItem}
            handleUpdateItemStatus={handleUpdateItemStatus}
            handleAddAdmin={handleAddAdmin}
            addUser={addUser}
          />
        )}
        
        {showAdminEditor && (
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AdminUserEditor 
                onClose={() => setShowAdminEditor(false)}
                onSave={handleAdminSaved}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
