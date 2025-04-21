
import React from "react";
import { User, Item } from '@/types';
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  FileDown, 
  PlusCircle, 
  UserPlus, 
  Edit, 
  ShieldCheck, 
  Trash2, 
  Check, 
  XCircle, 
  Clock 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface UsersTabProps {
  users: User[];
  items: Item[];
  handleEditUser: (userId: string) => void;
  handleAddUser: () => void;
  handleDeleteUser: (userId: string) => void;
  handleAddAdmin: () => void;
  addUser: (user: User) => void;
}

export const UsersTab = ({ 
  users, 
  items, 
  handleEditUser, 
  handleAddUser, 
  handleDeleteUser, 
  handleAddAdmin, 
  addUser 
}: UsersTabProps) => {
  // Defensive: always use an array
  const safeUsers = Array.isArray(users) ? users : [];
  const { toast } = useToast();

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
                {safeUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="w-24 flex items-center">
                        <ErrorBoundary>
                          <span className="font-semibold mr-2">{user.reputation ?? 0}</span>
                          <Select defaultValue={(user.reputation ?? 0).toString()} onValueChange={(value) => {
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
                    <TableCell>{user.joinedDate ? new Date(user.joinedDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''}</TableCell>
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
    </motion.div>
  );
};
