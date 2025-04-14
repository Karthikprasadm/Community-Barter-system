
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useBarterContext } from "@/context/BarterContext";
import { Header } from "@/components/layout/Header";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Database, 
  ShieldCheck, 
  Users, 
  Package, 
  RefreshCw, 
  Plus,
  FileDown,
  Activity,
  BarChart3,
  PlayCircle,
  Save,
  XCircle,
  Check,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";

// Lazily load complex components
const ActivityLog = lazy(() => import('@/components/ui/ActivityLog').then(mod => ({ default: mod.ActivityLog })));
const DataExport = lazy(() => import('@/components/ui/DataExport').then(mod => ({ default: mod.DataExport })));
const UserEditor = lazy(() => import('@/components/ui/UserEditor').then(mod => ({ default: mod.UserEditor })));
const ItemEditor = lazy(() => import('@/components/ui/ItemEditor').then(mod => ({ default: mod.ItemEditor })));
const AdminUserEditor = lazy(() => import('@/components/ui/AdminUserEditor').then(mod => ({ default: mod.AdminUserEditor })));
const AdminUserList = lazy(() => import('@/components/ui/AdminUserList').then(mod => ({ default: mod.AdminUserList })));
const AdminCharts = lazy(() => import('@/components/ui/AdminCharts').then(mod => ({ default: mod.AdminCharts })));

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const { isAdmin, isHeadAdmin, users, items, trades, addUser, deleteUser, updateItem, deleteItem, addItem } = useBarterContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [showAdminEditor, setShowAdminEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("database");
  const [sqlQuery, setSqlQuery] = useState("SELECT u.username, COUNT(i.id) as item_count \nFROM users u\nLEFT JOIN items i ON u.id = i.userId\nGROUP BY u.id\nORDER BY item_count DESC;");
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [isQueryEditable, setIsQueryEditable] = useState(false);
  const { toast } = useToast();
  
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

  // Execute initial query
  useEffect(() => {
    if (!isLoading && activeTab === 'database') {
      handleExecuteQuery();
    }
  }, [isLoading, activeTab]);

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
  
  const handleAddAdmin = () => {
    setShowAdminEditor(true);
  };
  
  const handleAdminSaved = () => {
    setShowAdminEditor(false);
  };

  const handleExecuteQuery = () => {
    setIsQueryExecuting(true);
    
    // Mock query execution with timeout
    setTimeout(() => {
      try {
        // Create mock query result based on the query
        let result = [];
        
        if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('users')) {
          result = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            reputation: user.reputation,
            joinedDate: user.joinedDate,
            item_count: items.filter(item => item.userId === user.id).length
          }));
        } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('items')) {
          result = items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            userId: item.userId,
            isAvailable: item.isAvailable ? 'Available' : 'Not Available',
            postedDate: item.postedDate
          }));
        } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('trades')) {
          result = trades.map(trade => ({
            id: trade.id,
            offerId: trade.offerId,
            tradeDate: trade.tradeDate,
            notes: trade.notes || 'No notes'
          }));
        } else {
          // Default query result
          result = users.map(user => ({
            username: user.username,
            item_count: items.filter(item => item.userId === user.id).length
          }));
        }
        
        setQueryResult(result);
        toast({
          title: "Query executed successfully",
          description: `Returned ${result.length} rows`,
        });
      } catch (error) {
        console.error("Query execution error:", error);
        toast({
          variant: "destructive",
          title: "Query execution failed",
          description: "There was an error executing your SQL query",
        });
        setQueryResult([]);
      } finally {
        setIsQueryExecuting(false);
      }
    }, 800);
  };

  const handleClearQuery = () => {
    setSqlQuery("");
    setQueryResult([]);
  };

  const handleSaveResult = () => {
    try {
      // Here we would typically save changes to the database
      // For this mock, we'll just show a success toast
      toast({
        title: "Changes saved",
        description: "Your changes have been saved to the database",
      });
      setIsQueryEditable(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your changes",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUser(userId);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      deleteItem(itemId);
    }
  };

  const handleUpdateItemStatus = (itemId: string, status: boolean) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem({
        ...item,
        isAvailable: status
      });
    }
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
            {[1, 2, 3].map(i => (
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
        
        {/* Statistics Cards */}
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
            <Card className="border-green-100 hover:border-green-200 transition-colors">
              <CardHeader className="pb-2 bg-green-50">
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
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
            <Card className="border-amber-100 hover:border-amber-200 transition-colors">
              <CardHeader className="pb-2 bg-amber-50">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
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
                      Execute SQL queries against the platform database and edit results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm">
                        <div className="flex items-center justify-between gap-2 mb-2 text-gray-400 border-b border-gray-700 pb-2">
                          <span>Database SQL Query Console</span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleClearQuery}
                              className="h-7 px-2 bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                            >
                              Clear
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleExecuteQuery}
                              disabled={isQueryExecuting}
                              className="h-7 px-2 bg-green-700 hover:bg-green-600 text-green-50 border-green-600 flex items-center gap-1"
                            >
                              {isQueryExecuting ? (
                                <><RefreshCw className="h-3 w-3 animate-spin" /> Running...</>
                              ) : (
                                <><PlayCircle className="h-3 w-3" /> Execute</>
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-green-400">-- Type your SQL query below:</p>
                          <Textarea 
                            value={sqlQuery}
                            onChange={(e) => setSqlQuery(e.target.value)}
                            className="text-gray-300 bg-gray-900 p-2 rounded mt-2 overflow-x-auto h-32 font-mono text-sm resize-none border-gray-700 focus:border-blue-500"
                            placeholder="Enter SQL query..."
                          />
                        </div>
                        <div className="bg-gray-900 p-2 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-blue-400">-- Query Results:</p>
                            <div className="flex gap-2">
                              {isQueryEditable ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsQueryEditable(false)}
                                    className="h-6 px-2 bg-red-700 hover:bg-red-600 text-red-50 border-red-600 flex items-center gap-1"
                                  >
                                    <XCircle className="h-3 w-3" /> Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSaveResult}
                                    className="h-6 px-2 bg-green-700 hover:bg-green-600 text-green-50 border-green-600 flex items-center gap-1"
                                  >
                                    <Save className="h-3 w-3" /> Save
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setIsQueryEditable(true)}
                                  className="h-6 px-2 bg-blue-700 hover:bg-blue-600 text-blue-50 border-blue-600 flex items-center gap-1"
                                >
                                  Edit Results
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {queryResult.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-gray-300 text-sm">
                                <thead>
                                  <tr className="border-b border-gray-700">
                                    {Object.keys(queryResult[0]).map((key) => (
                                      <th key={key} className="py-2 px-3 text-left">{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {queryResult.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-gray-800">
                                      {Object.entries(row).map(([key, value], cellIndex) => (
                                        <td key={`${rowIndex}-${cellIndex}`} className="py-2 px-3">
                                          {isQueryEditable ? (
                                            <Input
                                              value={String(value)}
                                              className="bg-gray-800 border-gray-700 text-gray-300 h-7 text-xs"
                                              onChange={(e) => {
                                                const updatedResult = [...queryResult];
                                                updatedResult[rowIndex] = {
                                                  ...updatedResult[rowIndex],
                                                  [key]: e.target.value
                                                };
                                                setQueryResult(updatedResult);
                                              }}
                                            />
                                          ) : (
                                            String(value)
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 py-2">No results to display</p>
                          )}
                        </div>
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
                              <TableHead>Status</TableHead>
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
                                  <div className="w-24 flex items-center">
                                    <ErrorBoundary>
                                      <span className="font-semibold mr-2">{user.reputation}</span>
                                      <Select defaultValue={user.reputation.toString()} onValueChange={(value) => {
                                        const updatedUser = {...user, reputation: parseFloat(value)};
                                        addUser(updatedUser);
                                        toast({
                                          title: "Reputation updated",
                                          description: `${user.username}'s reputation updated to ${value}`,
                                        });
                                      }}>
                                        <SelectTrigger className="w-16 h-7">
                                          <SelectValue placeholder="Score" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">0</SelectItem>
                                          <SelectItem value="1">1</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </ErrorBoundary>
                                  </div>
                                </TableCell>
                                <TableCell>{user.joinedDate}</TableCell>
                                <TableCell>
                                  <Select defaultValue="active" onValueChange={(value) => {
                                    toast({
                                      title: "Status updated",
                                      description: `${user.username}'s status updated to ${value}`,
                                    });
                                  }}>
                                    <SelectTrigger className="w-28 h-7">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">
                                        <span className="flex items-center gap-1">
                                          <Check className="h-3 w-3 text-green-500" /> Active
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="inactive">
                                        <span className="flex items-center gap-1">
                                          <XCircle className="h-3 w-3 text-red-500" /> Inactive
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="pending">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3 text-amber-500" /> Pending
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        Actions
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                        Edit User
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-purple-600"
                                        onClick={handleAddAdmin}
                                      >
                                        Make Admin
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                                    <Select 
                                      defaultValue={item.isAvailable ? "available" : "traded"}
                                      onValueChange={(value) => {
                                        handleUpdateItemStatus(item.id, value === "available");
                                      }}
                                    >
                                      <SelectTrigger className="w-28 h-7">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="available">
                                          <span className="flex items-center gap-1 text-green-600">
                                            <Check className="h-3 w-3" /> Available
                                          </span>
                                        </SelectItem>
                                        <SelectItem value="traded">
                                          <span className="flex items-center gap-1 text-red-600">
                                            <XCircle className="h-3 w-3" /> Traded
                                          </span>
                                        </SelectItem>
                                        <SelectItem value="booked">
                                          <span className="flex items-center gap-1 text-amber-600">
                                            <Clock className="h-3 w-3" /> Booked
                                          </span>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="text-blue-600 hover:text-blue-900"
                                        >
                                          Actions
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditItem(item.id)}>
                                          Edit Item
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          className="text-red-600"
                                          onClick={() => handleDeleteItem(item.id)}
                                        >
                                          Delete Item
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
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
            
            <TabsContent value="analytics" key="analytics">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorBoundary>
                  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <AdminCharts />
                  </Suspense>
                </ErrorBoundary>
                
                {isHeadAdmin && (
                  <div className="mt-8">
                    {showAdminEditor ? (
                      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                        <AdminUserEditor
                          onClose={() => setShowAdminEditor(false)}
                          onSave={handleAdminSaved}
                        />
                      </Suspense>
                    ) : (
                      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                        <AdminUserList onAddAdmin={handleAddAdmin} />
                      </Suspense>
                    )}
                  </div>
                )}
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
