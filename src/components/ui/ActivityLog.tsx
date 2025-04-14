
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
  id: string;
  timestamp: string;
  type: ActivityType;
  description: string;
  userId?: string;
  username?: string;
}

const MOCK_ACTIVITIES: ActivityEntry[] = [
  { 
    id: 'act1', 
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
    type: 'login', 
    description: 'Admin login successful', 
    userId: 'admin',
    username: 'Admin'
  },
  { 
    id: 'act2', 
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), 
    type: 'user', 
    description: 'User profile updated', 
    userId: 'user1',
    username: 'john_doe'
  },
  { 
    id: 'act3', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), 
    type: 'item', 
    description: 'New item added: Vintage Camera', 
    userId: 'user1',
    username: 'john_doe'
  },
  { 
    id: 'act4', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
    type: 'trade', 
    description: 'Trade completed between user2 and user4', 
  },
  { 
    id: 'act5', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), 
    type: 'system', 
    description: 'Daily system backup completed', 
  },
  { 
    id: 'act6', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), 
    type: 'offer', 
    description: 'New offer created: Hiking Boots for Fiction Book Collection', 
    userId: 'user1',
    username: 'john_doe'
  },
  { 
    id: 'act7', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), 
    type: 'login', 
    description: 'Failed login attempt', 
  },
  { 
    id: 'act8', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
    type: 'user', 
    description: 'New user registered', 
    userId: 'user4',
    username: 'sam_taylor'
  },
];

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
  
  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActivities(MOCK_ACTIVITIES);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
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
    
  const handleClearLogs = () => {
    setActivities([]);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActivities(MOCK_ACTIVITIES);
      setIsLoading(false);
    }, 800);
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
