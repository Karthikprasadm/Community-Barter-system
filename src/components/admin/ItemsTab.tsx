
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Edit, 
  XCircle, 
  Check, 
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface ItemsTabProps {
  users: User[];
  items: Item[];
  handleEditItem: (itemId: string) => void;
  handleAddItem: () => void;
  handleDeleteItem: (itemId: string) => void;
  handleUpdateItemStatus: (itemId: string, status: boolean) => void;
}

export const ItemsTab = ({ 
  users, 
  items, 
  handleEditItem, 
  handleAddItem,
  handleDeleteItem,
  handleUpdateItemStatus 
}: ItemsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Example API call using apiUrl from .env
  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/items`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched items from backend:', data);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
      });
  }, []);

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (itemId: string, status: boolean) => {
    handleUpdateItemStatus(itemId, status);
    toast({
      title: `Item ${status ? 'Available' : 'Unavailable'}`,
      description: `Item status has been updated.`,
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
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
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items by name, category or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" title="Filter">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

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
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const owner = users.find(u => u.id === item.userId);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell>{owner?.username || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 h-2 w-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span>{item.isAvailable ? 'Available' : 'Not Available'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.postedDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditItem(item.id)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, !item.isAvailable)}>
                                {item.isAvailable ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2 text-orange-500" /> Mark Unavailable
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2 text-green-500" /> Mark Available
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  handleDeleteItem(item.id);
                                  toast({
                                    title: "Item deleted",
                                    description: `${item.name} has been removed.`,
                                    variant: "default",
                                  });
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
