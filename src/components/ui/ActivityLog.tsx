
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Filter, DownloadCloud, Trash, RefreshCw, Clock } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

type ActivityType = 'login' | 'item' | 'user' | 'trade' | 'offer' | 'system';

interface ActivityEntry {
  id: number;
  timestamp: string;
  type: ActivityType;
  description: string;
  userId?: number;
  username?: string;
}

// import io from 'socket.io-client';
import { useEffect } from 'react';

const typeColors: Record<ActivityType, string> = {
  login: 'bg-blue-100 text-blue-800',
  item: 'bg-green-100 text-green-800',
  user: 'bg-purple-100 text-purple-800',
  trade: 'bg-amber-100 text-amber-800',
  offer: 'bg-indigo-100 text-indigo-800',
  system: 'bg-gray-100 text-gray-800',
};

const typeIcons: Record<ActivityType, React.ReactNode> = {
  login: <span className="h-4 w-4 text-blue-500">👤</span>,
  item: <span className="h-4 w-4 text-green-500">📦</span>,
  user: <span className="h-4 w-4 text-purple-500">👥</span>,
  trade: <span className="h-4 w-4 text-amber-500">🔄</span>,
  offer: <span className="h-4 w-4 text-indigo-500">📝</span>,
  system: <span className="h-4 w-4 text-gray-500">⚙️</span>,
};

export const ActivityLog: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  
  // Fetch real activities from backend and listen for real-time updates
  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/activity-log`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setIsLoading(false);
      });
    // Real-time updates
    // Dynamically import socket.io-client to avoid SSR issues
    let socket;
    import('socket.io-client').then(({ default: io }) => {
      socket = io(import.meta.env.VITE_API_URL);
      socket.on('activity_log_update', (newActivity) => {
        setActivities(prev => [newActivity, ...prev]);
      });
    });
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };
  
  const filteredActivities = filter 
    ? activities.filter(activity => activity.type === filter)
    : activities;
    
  const handleClearLogs = async () => {
    setIsLoading(true);
    await fetch(`${import.meta.env.VITE_API_URL}/api/activity-log/clear`, { method: 'POST', credentials: 'include' });
    setActivities([]);
    setIsLoading(false);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/activity-log`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setIsLoading(false);
      });
  };
  
  const handleExport = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Log
          </CardTitle>
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Log
          </CardTitle>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  {filter ? `Filter: ${filter}` : "All Activities"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                  <DropdownMenuRadioItem value={undefined}>All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="login">Login</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="item">Item</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="trade">Trade</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="offer">Offer</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleExport}
            >
              <DownloadCloud className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <CardDescription>
          {filteredActivities.length} {filter ? `${filter} ` : ''}activities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {filteredActivities.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start p-3 rounded-md border border-muted hover:bg-muted/50 transition-colors"
              >
                <div className="h-7 w-7 rounded-full flex items-center justify-center mr-3">
                  {typeIcons[activity.type]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{activity.description}</div>
                      {activity.username && (
                        <div className="text-xs text-muted-foreground mt-1">by {activity.username}</div>
                      )}
                    </div>
                    <div className="flex items-center ml-3 flex-shrink-0">
                      <div className={`px-2 py-1 rounded-full text-xs ${typeColors[activity.type]}`}>
                        {activity.type}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-3 flex-shrink-0 flex items-center">
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getRelativeTime(activity.timestamp)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mb-3 text-muted" />
            <p>No activities found</p>
            <p className="text-xs mt-1">Try changing the filter or refreshing</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between border-t pt-4">
        <Button 
          variant="destructive" 
          size="sm" 
          disabled={activities.length === 0}
          onClick={handleClearLogs}
          className="gap-1"
        >
          <Trash className="h-4 w-4" />
          Clear Logs
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};
