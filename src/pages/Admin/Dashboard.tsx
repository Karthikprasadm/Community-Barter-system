
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useBarterContext } from "@/context/BarterContext";
import { Header } from "@/components/layout/Header";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  ShieldCheck, 
  Users, 
  Package, 
  RefreshCw, 
  Plus,
  FileDown,
  Activity 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Lazily load complex components
const ActivityLog = lazy(() => import('@/components/ui/ActivityLog').then(mod => ({ default: mod.ActivityLog })));
const DataExport = lazy(() => import('@/components/ui/DataExport').then(mod => ({ default: mod.DataExport })));
const UserEditor = lazy(() => import('@/components/ui/UserEditor').then(mod => ({ default: mod.UserEditor })));
const ItemEditor = lazy(() => import('@/components/ui/ItemEditor').then(mod => ({ default: mod.ItemEditor })));

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { isAdmin, users, items, trades } = useBarterContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("database");
  
  // Simulate loading state for smoother UX
  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null; // Will redirect due to the useEffect
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, a3].map(i => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
          
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-80 w-full" />
        </main>
      </div>
    );
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
            </h1>
            <p className="text-gray-600 mt-1">Manage all aspects of the BarterNexus platform</p>
          </div>
          
          <Button size="sm" variant="outline" className="gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-500">Registered accounts</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  Active Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{items.filter(item => item.isAvailable).length}</p>
                <p className="text-sm text-gray-500">Items available for trade</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-amber-500" />
                  Completed Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{trades.length}</p>
                <p className="text-sm text-gray-500">Successful exchanges</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
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
            <TabsTrigger value="export" className="flex items-center gap-2 py-3">
              <FileDown className="h-4 w-4" />
              Data Export
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="database" key="database">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>SQL Query Tool</CardTitle>
                    <CardDescription>
                      Execute SQL queries against the platform database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-700 pb-2">
                          <span>Mockup SQL Query Console</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-green-400">-- Type your SQL query below:</p>
                          <pre className="text-gray-300 bg-gray-900 p-2 rounded mt-2 overflow-x-auto">
                            {`SELECT u.username, COUNT(i.id) as item_count 
FROM users u
LEFT JOIN items i ON u.id = i.userId
GROUP BY u.id
ORDER BY item_count DESC;`}
                          </pre>
                        </div>
                        <div className="bg-gray-900 p-2 rounded">
                          <p className="text-blue-400 mb-2">-- Query Results:</p>
                          <pre className="text-gray-300">
{`| username    | item_count |
|------------|------------|
| john_doe    | 2          |
| jane_smith  | 2          |
| alex_wilson | 2          |
| sam_taylor  | 2          |
`}
                          </pre>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline">Clear</Button>
                        <Button>Execute Query</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="users" key="users">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
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
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>User Management</CardTitle>
                        <Button 
                          onClick={handleAddUser}
                          className="gap-1"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" /> Add User
                        </Button>
                      </div>
                      <CardDescription>
                        View and manage platform users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Username</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Reputation</TableHead>
                              <TableHead>Joined Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                <TableCell className="font-medium flex items-center gap-2">
                                  {user.profileImage && (
                                    <img 
                                      src={user.profileImage} 
                                      alt={user.username} 
                                      className="h-6 w-6 rounded-full object-cover"
                                    />
                                  )}
                                  {user.username}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <div className="w-24">
                                    <ErrorBoundary>
                                      {user.reputation}
                                    </ErrorBoundary>
                                  </div>
                                </TableCell>
                                <TableCell>{user.joinedDate}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-600 hover:text-blue-900"
                                    onClick={() => handleEditUser(user.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="items" key="items">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {showItemEditor ? (
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
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Item Management</CardTitle>
                        <Button 
                          onClick={handleAddItem}
                          className="gap-1"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" /> Add Item
                        </Button>
                      </div>
                      <CardDescription>
                        Manage all items listed on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Condition</TableHead>
                              <TableHead>Owner</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item) => {
                              const owner = users.find(u => u.id === item.userId);
                              return (
                                <TableRow key={item.id}>
                                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell>{item.condition}</TableCell>
                                  <TableCell>{owner?.username || 'Unknown'}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {item.isAvailable ? 'Available' : 'Traded'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-blue-600 hover:text-blue-900"
                                      onClick={() => handleEditItem(item.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="activity" key="activity">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorBoundary>
                  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <ActivityLog />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="export" key="export">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorBoundary>
                  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <DataExport />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
