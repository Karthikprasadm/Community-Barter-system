
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
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Package, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBarterContext } from "@/context/BarterContext";
import { Item } from "@/types";
import { categories, conditions } from "@/data/mockData";
import { motion } from "framer-motion";

interface ItemEditorProps {
  item?: Item;
  onClose: () => void;
  onSave: () => void;
}

const itemSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be at most 500 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  condition: z.enum(["New", "Like New", "Good", "Fair", "Poor"], {
    required_error: "Please select a condition",
  }),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  userId: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export const ItemEditor: React.FC<ItemEditorProps> = ({ item, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser, addItem, updateItem } = useBarterContext();
  
  const defaultValues: Partial<ItemFormValues> = {
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    condition: item?.condition || 'Good',
    isAvailable: item?.isAvailable ?? true,
    imageUrl: item?.imageUrl || '',
    userId: item?.userId || currentUser?.id,
  };
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: ItemFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (item) {
        // Update existing item
        updateItem({
          ...item,
          name: values.name,
          description: values.description,
          category: values.category,
          condition: values.condition,
          isAvailable: values.isAvailable,
          imageUrl: values.imageUrl,
        });
        
        toast({
          title: "Item updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Add new item
        addItem({
          name: values.name,
          description: values.description,
          category: values.category,
          condition: values.condition,
          isAvailable: values.isAvailable,
          imageUrl: values.imageUrl,
        });
        
        toast({
          title: "Item added",
          description: `${values.name} has been added successfully.`,
        });
      }
      
      onSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving the item.",
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
              <Package className="h-5 w-5 text-primary" />
              {item ? 'Edit Item' : 'Add New Item'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {item ? 'Update item details' : 'Add a new item to the marketplace'}
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Vintage Camera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your item in detail..." 
                        {...field} 
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Be detailed about the condition, features, and history of the item
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("imageUrl") && (
                <div className="border rounded-md p-4 flex justify-center">
                  <img 
                    src={form.watch("imageUrl")} 
                    alt="Item preview"
                    className="max-h-40 max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              )}
              
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available for Trade</FormLabel>
                      <FormDescription>
                        Mark if this item is currently available for trading
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                    <span>Save Item</span>
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
