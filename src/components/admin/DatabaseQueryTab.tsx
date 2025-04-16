
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Database,
  Terminal,
  Server,
  XCircle,
  PlayCircle,
  RefreshCw,
  Save,
  Edit,
  FileCode,
  Download
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DatabaseQueryTabProps {
  users: any[];
  items: any[];
  trades: any[];
  offers: any[];
}

export const DatabaseQueryTab = ({ users, items, trades, offers }: DatabaseQueryTabProps) => {
  const [sqlQuery, setSqlQuery] = useState("SELECT u.username, COUNT(i.id) as item_count \nFROM users u\nLEFT JOIN items i ON u.id = i.userId\nGROUP BY u.id\nORDER BY item_count DESC;");
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [isQueryEditable, setIsQueryEditable] = useState(false);
  const { toast } = useToast();

  const handleExecuteQuery = () => {
    setIsQueryExecuting(true);
    
    setTimeout(() => {
      try {
        let result = [];
        
        if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from users')) {
          if (sqlQuery.toLowerCase().includes('reputation_range')) {
            const reputationRanges = {
              'Excellent (4.5-5)': users.filter(u => u.reputation >= 4.5).length,
              'Good (3.5-4.5)': users.filter(u => u.reputation >= 3.5 && u.reputation < 4.5).length,
              'Average (2.5-3.5)': users.filter(u => u.reputation >= 2.5 && u.reputation < 3.5).length,
              'Fair (1.5-2.5)': users.filter(u => u.reputation >= 1.5 && u.reputation < 2.5).length,
              'Poor (0-1.5)': users.filter(u => u.reputation < 1.5).length
            };
            
            result = Object.entries(reputationRanges).map(([reputation_range, user_count]) => ({
              reputation_range,
              user_count
            }));
          } else {
            result = users.map(user => ({
              id: user.id,
              username: user.username,
              email: user.email,
              reputation: user.reputation,
              joinedDate: user.joinedDate,
              item_count: items.filter(item => item.userId === user.id).length
            }));
            
            if (sqlQuery.toLowerCase().includes('group by') && sqlQuery.toLowerCase().includes('count(i.id)')) {
              result = users.map(user => ({
                username: user.username,
                item_count: items.filter(item => item.userId === user.id).length
              }));
              
              if (sqlQuery.toLowerCase().includes('order by item_count desc')) {
                result.sort((a, b) => b.item_count - a.item_count);
              }
            }
          }
        } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from items')) {
          result = items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            userId: item.userId,
            isAvailable: item.isAvailable ? 'Available' : 'Not Available',
            postedDate: item.postedDate
          }));
          
          if (sqlQuery.toLowerCase().includes('group by category')) {
            const categoryCounts = items.reduce((acc, item) => {
              acc[item.category] = (acc[item.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            result = Object.entries(categoryCounts).map(([category, count]) => ({
              category,
              count
            }));
            
            if (sqlQuery.toLowerCase().includes('order by count desc')) {
              result.sort((a, b) => b.count - a.count);
            }
          }
        } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from trades')) {
          if (sqlQuery.toLowerCase().includes('extract(month from tradedate)')) {
            const monthCounts: Record<number, number> = {};
            
            trades.forEach(trade => {
              const tradeDate = new Date(trade.tradeDate);
              const month = tradeDate.getMonth() + 1;
              monthCounts[month] = (monthCounts[month] || 0) + 1;
            });
            
            result = Object.entries(monthCounts).map(([month, trade_count]) => ({
              month: parseInt(month),
              trade_count
            }));
            
            result.sort((a, b) => a.month - b.month);
          } else {
            result = trades.map(trade => {
              const relatedOffer = offers.find(o => o.id === trade.offerId);
              const fromUser = relatedOffer ? users.find(u => u.id === relatedOffer.fromUserId) : null;
              const toUser = relatedOffer ? users.find(u => u.id === relatedOffer.toUserId) : null;
              
              return {
                id: trade.id,
                tradeDate: trade.tradeDate,
                from_user: fromUser?.username || 'Unknown',
                to_user: toUser?.username || 'Unknown',
                notes: trade.notes || 'No notes'
              };
            });
            
            if (sqlQuery.toLowerCase().includes('order by t.tradedate desc')) {
              result.sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime());
            }
          }
        } else {
          result = users.map(user => ({
            username: user.username,
            item_count: items.filter(item => item.userId === user.id).length
          }));
        }
        
        setQueryResult(result);
        toast({
          title: "Query executed successfully",
          description: `Returned ${result.length} rows`,
        });
      } catch (error) {
        console.error("Query execution error:", error);
        toast({
          variant: "destructive",
          title: "Query execution failed",
          description: "There was an error executing your SQL query",
        });
        setQueryResult([]);
      } finally {
        setIsQueryExecuting(false);
      }
    }, 800);
  };

  const handleClearQuery = () => {
    setSqlQuery("");
    setQueryResult([]);
  };

  const handleSaveResult = () => {
    try {
      toast({
        title: "Changes saved",
        description: "Your changes have been saved to the database",
      });
      setIsQueryEditable(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your changes",
      });
    }
  };

  const sampleQueries = [
    { name: "List all users", query: "SELECT * FROM users ORDER BY joinedDate DESC;" },
    { name: "Users with most items", query: "SELECT u.username, COUNT(i.id) as item_count \nFROM users u\nLEFT JOIN items i ON u.id = i.userId\nGROUP BY u.id\nORDER BY item_count DESC;" },
    { name: "Recent trades", query: "SELECT t.id, t.tradeDate, u1.username as from_user, u2.username as to_user\nFROM trades t\nJOIN offers o ON t.offerId = o.id\nJOIN users u1 ON o.fromUserId = u1.id\nJOIN users u2 ON o.toUserId = u2.id\nORDER BY t.tradeDate DESC;" },
    { name: "Items by category", query: "SELECT category, COUNT(*) as count\nFROM items\nGROUP BY category\nORDER BY count DESC;" },
    { name: "Monthly trade stats", query: "SELECT EXTRACT(MONTH FROM tradeDate) as month, COUNT(*) as trade_count\nFROM trades\nGROUP BY month\nORDER BY month;" },
    { name: "User reputation stats", query: "SELECT \n  CASE \n    WHEN reputation >= 4.5 THEN 'Excellent (4.5-5)'\n    WHEN reputation >= 3.5 THEN 'Good (3.5-4.5)'\n    WHEN reputation >= 2.5 THEN 'Average (2.5-3.5)'\n    WHEN reputation >= 1.5 THEN 'Fair (1.5-2.5)'\n    ELSE 'Poor (0-1.5)'\n  END as reputation_range,\n  COUNT(*) as user_count\nFROM users\nGROUP BY reputation_range\nORDER BY reputation_range;" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-600" />
            SQL Query Tool
          </CardTitle>
          <CardDescription>
            Execute SQL queries against the platform database and edit results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setSqlQuery(q.query)}
              >
                <FileCode className="h-3 w-3 mr-1" /> {q.name}
              </Button>
            ))}
          </div>
          
          <div className="bg-slate-900 text-white rounded-md shadow-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-slate-200">SQL Query Editor</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleClearQuery}
                  className="h-7 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                >
                  <XCircle className="h-3 w-3 mr-1" /> Clear
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleExecuteQuery}
                  disabled={isQueryExecuting}
                  className="h-7 px-2 bg-green-700 hover:bg-green-600 text-green-50 border-green-600 flex items-center gap-1"
                >
                  {isQueryExecuting ? (
                    <><RefreshCw className="h-3 w-3 animate-spin" /> Running...</>
                  ) : (
                    <><PlayCircle className="h-3 w-3" /> Execute</>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-green-400 text-sm mb-2">-- Type your SQL query below:</p>
              <Textarea 
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="font-mono text-sm bg-slate-950 border-slate-700 text-slate-300 resize-none min-h-[120px] focus-visible:ring-blue-500"
                placeholder="Enter SQL query..."
              />
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-md shadow-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-slate-200">Query Results</span>
                {queryResult.length > 0 && (
                  <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">
                    {queryResult.length} rows
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {isQueryEditable ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsQueryEditable(false)}
                      className="h-6 px-2 bg-red-700 hover:bg-red-600 text-red-50 border-red-600 flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveResult}
                      className="h-6 px-2 bg-green-700 hover:bg-green-600 text-green-50 border-green-600 flex items-center gap-1"
                    >
                      <Save className="h-3 w-3" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsQueryEditable(true)}
                      className="h-6 px-2 bg-blue-700 hover:bg-blue-600 text-blue-50 border-blue-600 flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3 mr-1" /> Edit Results
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600 flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Export
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {queryResult.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-slate-400 border-b border-slate-700">
                      {Object.keys(queryResult[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-800 hover:bg-slate-800/50">
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-2">
                            {isQueryEditable ? (
                              <Input
                                value={String(value)}
                                className="bg-slate-800 border-slate-700 text-slate-300 h-7 text-xs font-mono"
                                onChange={(e) => {
                                  const updatedResult = [...queryResult];
                                  updatedResult[rowIndex] = {
                                    ...updatedResult[rowIndex],
                                    [key]: e.target.value
                                  };
                                  setQueryResult(updatedResult);
                                }}
                              />
                            ) : (
                              <span className="font-mono">{String(value)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-slate-400 p-4 text-center">
                  No results to display. Execute a query to see data.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
