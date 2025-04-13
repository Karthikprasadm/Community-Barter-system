
import { useEffect } from "react";
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
import { Database, ShieldCheck, Users, Package, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, users, items, trades } = useBarterContext();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null; // Will redirect due to the useEffect
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
          
          <Button size="sm" variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>
        
        {/* Admin Tabs */}
        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="database" className="flex items-center gap-2 py-3">
              <Database className="h-4 w-4" /> 
              Database Query Tool
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2 py-3">
              <Package className="h-4 w-4" />
              Item Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="database">
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
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.reputation}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Item Management</CardTitle>
                <CardDescription>
                  Manage all items listed on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => {
                        const owner = users.find(u => u.id === item.userId);
                        return (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.condition}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{owner?.username || 'Unknown'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.isAvailable ? 'Available' : 'Traded'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">Delete</Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
