
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Repeat, PackageCheck, Package, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useBarterContext } from "@/context/BarterContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TradeHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const { getUserTrades, trades, offers, items, getItemById, getUserById, isAdmin } = useBarterContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show all trades for admin, or user-specific trades otherwise
  const tradesToShow = isAdmin ? trades : getUserTrades(userId);

  // Debug logs
  console.log("All items:", items);

  // Process trade data to include more details
  const tradeItems = tradesToShow.map(trade => {
    const offer = offers.find(o => o.id === trade.offerId);
    
    if (!offer) return null;
    
    const itemOffered = getItemById(offer.itemOfferedId);
    const itemRequested = getItemById(offer.itemRequestedId);
    console.log("Offer IDs:", offer.itemOfferedId, offer.itemRequestedId);
    console.log("Item Offered:", itemOffered);
    console.log("Item Requested:", itemRequested);
    const offerMaker = getUserById(offer.fromUserId);
    const offerReceiver = getUserById(offer.toUserId);
    
    return {
      id: trade.id,
      tradeDate: trade.tradeDate,
      notes: trade.notes,
      itemOffered: itemOffered?.name || 'Unknown Item',
      itemOfferedCategory: itemOffered?.category || 'Unknown',
      itemRequested: itemRequested?.name || 'Unknown Item',
      itemRequestedCategory: itemRequested?.category || 'Unknown',
      // Both usernames for clarity
      userSender: offerMaker?.username || 'Unknown User',
      userReceiver: offerReceiver?.username || 'Unknown User',
      withUser: offer.fromUserId === userId 
        ? offerReceiver?.username || 'Unknown User'
        : offerMaker?.username || 'Unknown User',
      isUserSender: offer.fromUserId === userId
    };
  }).filter(Boolean);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Trade History
          </CardTitle>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          Trade History
        </CardTitle>
        <CardDescription>
          {tradeItems.length} completed {tradeItems.length === 1 ? 'trade' : 'trades'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tradeItems.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-col space-y-3">
              {tradeItems.slice(0, isExpanded ? undefined : 3).map((trade, index) => (
                <motion.div
                  key={trade.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Trade between {trade.userSender} and {trade.userReceiver}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{trade.tradeDate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{trade.isUserSender ? "Sent:" : "Received:"}</span>
                      <Badge variant="outline" className="text-xs">
                        {trade.isUserSender ? trade.itemOffered : trade.itemRequested}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{trade.isUserSender ? "Received:" : "Sent:"}</span>
                      <Badge variant="outline" className="text-xs">
                        {trade.isUserSender ? trade.itemRequested : trade.itemOffered}
                      </Badge>
                    </div>
                  </div>
                  {trade.notes && (
                    <div className="mt-2 text-xs text-muted-foreground italic">
                      "{trade.notes}"
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {tradeItems.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleExpand}
                className="w-full text-xs flex items-center justify-center"
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                ) : (
                  <>Show More ({tradeItems.length - 3} more) <ChevronDown className="ml-1 h-4 w-4" /></>
                )}
              </Button>
            )}
            
            {isExpanded && tradeItems.length > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Received</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeItems.map((trade, index) => (
                        <TableRow key={trade.id || `row-${index}`}>
                          <TableCell>{trade.tradeDate}</TableCell>
                          <TableCell>{trade.userSender} &rarr; {trade.userReceiver}</TableCell>
                          <TableCell>{trade.isUserSender ? trade.itemOffered : trade.itemRequested}</TableCell>
                          <TableCell>{trade.isUserSender ? trade.itemRequested : trade.itemOffered}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mb-3 text-muted" />
            <p>No trades yet</p>
            <p className="text-xs mt-1">Completed trades will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
