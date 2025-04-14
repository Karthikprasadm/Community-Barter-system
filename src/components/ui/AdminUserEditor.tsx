
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, ShieldCheck, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBarterContext } from "@/context/BarterContext";
import { motion } from "framer-motion";

interface AdminUserEditorProps {
  onClose: () => void;
  onSave: () => void;
}

const adminUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
});

type AdminUserFormValues = z.infer<typeof adminUserSchema>;

export const AdminUserEditor: React.FC<AdminUserEditorProps> = ({ onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addAdminUser, isHeadAdmin } = useBarterContext();
  
  const defaultValues: AdminUserFormValues = {
    username: '',
    email: '',
  };
  
  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: AdminUserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isHeadAdmin) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Only the head administrator can create new admin users.",
        });
        return;
      }
      
      addAdminUser(values.username, values.email);
      onSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem creating the admin user.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              Add New Admin User
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Grant admin privileges to a new user
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin_username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                <p className="text-sm text-purple-700">
                  <strong>Note:</strong> New admin users will use the default password "wingspawn" for their first login.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || !isHeadAdmin}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Admin</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
};
