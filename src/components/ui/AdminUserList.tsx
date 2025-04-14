
import React from 'react';
import { useBarterContext } from '@/context/BarterContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { BadgeCheck, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface AdminUserListProps {
  onAddAdmin: () => void;
}

export const AdminUserList: React.FC<AdminUserListProps> = ({ onAddAdmin }) => {
  const { adminUsers, removeAdminUser, isHeadAdmin } = useBarterContext();
  const { toast } = useToast();
  
  const handleRemoveAdmin = (adminId: string, username: string, isHead: boolean) => {
    if (isHead) {
      toast({
        variant: "destructive",
        title: "Cannot remove head admin",
        description: "The head administrator cannot be removed from the system.",
      });
      return;
    }
    
    if (!isHeadAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only the head administrator can remove admin users.",
      });
      return;
    }
    
    // Confirm before removing
    if (window.confirm(`Are you sure you want to remove admin privileges from ${username}?`)) {
      removeAdminUser(adminId);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Admin Users</CardTitle>
            <CardDescription>Manage administrator accounts</CardDescription>
          </div>
          {isHeadAdmin && (
            <Button 
              onClick={onAddAdmin}
              className="flex items-center gap-1 bg-purple-700 hover:bg-purple-800"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-mono text-xs">{admin.id}</TableCell>
                      <TableCell className="font-semibold">{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.createdBy || "System"}</TableCell>
                      <TableCell>{admin.createdAt}</TableCell>
                      <TableCell>
                        {admin.isHeadAdmin ? (
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <ShieldAlert className="h-4 w-4" />
                            Head Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600">
                            <BadgeCheck className="h-4 w-4" />
                            Admin
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 hover:bg-red-50"
                          onClick={() => handleRemoveAdmin(admin.id, admin.username, admin.isHeadAdmin)}
                          disabled={admin.isHeadAdmin || !isHeadAdmin}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
