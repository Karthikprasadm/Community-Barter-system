
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat, PackageCheck, Package } from "lucide-react";
import { useBarterContext } from "@/context/BarterContext";

export const TradeHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const { getUserTrades, items } = useBarterContext();
  const trades = getUserTrades(userId);

  const tradeItems = trades.map(trade => {
    const offer = trade.offerId;  // Assuming offerId links to the original offer
    // You might need to enhance this logic based on your exact data structure
    return {
      tradeDate: trade.tradeDate,
      items: []  // Placeholder for traded items
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          Trade History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tradeItems.length > 0 ? (
          <div className="space-y-2">
            {tradeItems.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Trade completed</span>
                </div>
                <span className="text-xs text-muted-foreground">{trade.tradeDate}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            <Package className="h-6 w-6 mr-2" />
            No trades yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
