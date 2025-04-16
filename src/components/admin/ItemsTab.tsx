
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
  Trash2 
} from "lucide-react";

interface ItemsTabProps {
  users: any[];
  items: any[];
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
                            <DropdownMenuItem onClick={() => handleUpdateItemStatus(item.id, !item.isAvailable)}>
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
                            <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" /> Delete Item
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
    </motion.div>
  );
};
