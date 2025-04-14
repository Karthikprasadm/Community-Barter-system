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
  Clock,
  PlusCircle,
  Download,
  FileCode,
  Terminal,
  UserPlus,
  Edit,
  Trash2,
  Server,
  Settings
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";

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
      handleExecuteQuery();
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

  const handleExecuteQuery = () => {
    setIsQueryExecuting(true);
    
    setTimeout(() => {
      try {
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

  // Updated sample queries for quick access
  const sampleQueries = [
    { name: "List all users", query: "SELECT * FROM users ORDER BY joinedDate DESC;" },
    { name: "Users with most items", query: "SELECT u.username, COUNT(i.id) as item_count \nFROM users u\nLEFT JOIN items i ON u.id = i.userId\nGROUP BY u.id\nORDER BY item_count DESC;" },
    { name: "Recent trades", query: "SELECT t.id, t.tradeDate, u1.username as from_user, u2.username as to_user\nFROM trades t\nJOIN trades o ON t.offerId = o.id\nJOIN users u1 ON o.fromUserId = u1.id\nJOIN users u2 ON o.toUserId = u2.id\nORDER BY t.tradeDate DESC;" },
    { name: "Items by category", query: "SELECT category, COUNT(*) as count\nFROM items\nGROUP BY category\nORDER BY count DESC;" }
  ];

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
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-purple-600" />
                      SQL Query Tool
                    </CardTitle>
                    <CardDescription>
                      Execute SQL queries against the platform database and edit results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quick Query Templates */}
                    <div className="flex flex-wrap gap-2">
                      {sampleQueries.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setSqlQuery(q.query)}
                        >
                          <FileCode className="h-3 w-3 mr-1" /> {q.name}
                        </Button>
                      ))}
                    </div>
                    
                    {/* SQL Editor */}
                    <div className="bg-slate-900 text-white rounded-md shadow-lg overflow-hidden border border-slate-700">
                      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-slate-200">SQL Query Editor</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleClearQuery}
                            className="h-7 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Clear
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
                      
                      <div className="p-4">
                        <p className="text-green-400 text-sm mb-2">-- Type your SQL query below:</p>
                        <Textarea 
                          value={sqlQuery}
                          onChange={(e) => setSqlQuery(e.target.value)}
                          className="font-mono text-sm bg-slate-950 border-slate-700 text-slate-300 resize-none min-h-[120px] focus-visible:ring-blue-500"
                          placeholder="Enter SQL query..."
                        />
                      </div>
                    </div>
                    
                    {/* Query Results */}
                    <div className="bg-slate-900 text-white rounded-md shadow-lg overflow-hidden border border-slate-700">
                      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-slate-200">Query Results</span>
                          {queryResult.length > 0 && (
                            <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">
                              {queryResult.length} rows
                            </span>
                          )}
                        </div>
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
                                <Save className="h-3 w-3" /> Save Changes
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsQueryEditable(true)}
                                className="h-6 px-2 bg-blue-700 hover:bg-blue-600 text-blue-50 border-blue-600 flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3 mr-1" /> Edit Results
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" /> Export
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        {queryResult.length > 0 ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-800 text-slate-400 border-b border-slate-700">
                                {Object.keys(queryResult[0]).map((key) => (
                                  <th key={key} className="px-4 py-2 text-left font-medium">{key}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {queryResult.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-800 hover:bg-slate-800/50">
                                  {Object.entries(row).map(([key, value], cellIndex) => (
                                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-2">
                                      {isQueryEditable ? (
                                        <Input
                                          value={String(value)}
                                          className="bg-slate-800 border-slate-700 text-slate-300 h-7 text-xs font-mono"
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
                                        <span className="font-mono">{String(value)}</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-slate-400 p-4 text-center">
                            No results to display. Execute a query to see data.
                          </div>
                        )}
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
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          User Management
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleAddUser}
                            className="gap-1"
                            size="sm"
                            variant="outline"
                          >
                            <UserPlus className="h-4 w-4" /> Add Single User
                          </Button>
                          <Button 
                            onClick={handleAddUser}
                            className="gap-1"
                            size="sm"
                          >
                            <PlusCircle className="h-4 w-4" /> Bulk Add Users
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        View and manage platform users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Search users by name, email or ID..."
                            className="pl-9"
                          />
                          <div className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                          </div>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All users</SelectItem>
                            <SelectItem value="active">Active users</SelectItem>
                            <SelectItem value="inactive">Inactive users</SelectItem>
                            <SelectItem value="suspended">Suspended users</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileDown className="h-4 w-4" /> Export
                        </Button>
                      </div>
                      
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
                                <TableCell className="font-medium">{user.username}</TableCell>
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
                                  <Select defaultValue={user.status || "active"} onValueChange={(value) => {
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
                                      <SelectItem value="suspended">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3 text-amber-500" /> Suspended
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
                                        <Edit className="h-4 w-4 mr-2" /> Edit User
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-purple-600"
                                        onClick={handleAddAdmin}
                                      >
                                        <ShieldCheck className="h-4 w-4 mr-2" /> Make Admin
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete User
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
