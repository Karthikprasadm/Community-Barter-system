
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
import { UserReputation } from "@/components/ui/UserReputation";
import { Loader2, Save, User as UserIcon, X, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBarterContext } from "@/context/BarterContext";
import { User } from "@/types";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserEditorProps {
  user?: User;
  onClose: () => void;
  onSave: () => void;
}

const userSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  reputation: z.coerce.number()
    .min(0, { message: "Reputation cannot be negative" })
    .max(5, { message: "Reputation cannot exceed 5" })
    .optional(),
  profileImage: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
});

type UserFormValues = z.infer<typeof userSchema>;

export const UserEditor: React.FC<UserEditorProps> = ({ user, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addUser, updateUser, isAdmin } = useBarterContext();
  
  const defaultValues: Partial<UserFormValues> = {
    username: user?.username || '',
    email: user?.email || '',
    reputation: user?.reputation || 0,
    profileImage: user?.profileImage || '',
    status: 'active',
  };
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        // Update existing user
        updateUser({
          ...user,
          username: values.username,
          email: values.email,
          reputation: values.reputation!,
          profileImage: values.profileImage,
          status: values.status,
        });
        
        toast({
          title: "User updated",
          description: `${values.username} has been updated successfully.`,
        });
      } else {
        // Add new user
        addUser({
          username: values.username,
          email: values.email,
          reputation: values.reputation || 0,
          profileImage: values.profileImage,
          status: values.status,
        });
        
        toast({
          title: "User added",
          description: `${values.username} has been added successfully.`,
        });
      }
      
      onSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving the user.",
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
              <UserIcon className="h-5 w-5 text-primary" />
              {user ? 'Edit User' : 'Add New User'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {user ? 'Update user details' : 'Create a new user on the platform'}
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
                        <Input placeholder="johndoe" {...field} />
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
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reputation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reputation Score (0-5)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="5" 
                            {...field} 
                          />
                          <div className="pt-1">
                            <UserReputation 
                              score={parseFloat(field.value?.toString() || "0")} 
                              showTooltip={false} 
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {isAdmin && (
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Profile Image URL (Admin Only)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {form.watch("profileImage") && (
                <div className="border rounded-md p-4 flex justify-center">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-2">
                      <AvatarFallback>{form.watch("username").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-muted-foreground">
                      Preview of user avatar initial
                    </div>
                    {isAdmin && (
                      <div className="mt-4">
                        <img 
                          src={form.watch("profileImage") || "/placeholder.svg"} 
                          alt="Profile preview"
                          className="h-20 w-20 rounded-full object-cover border mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          Preview of custom image (Admin only)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save User</span>
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
