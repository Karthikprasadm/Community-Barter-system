import { Item, User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import clipboardBadge from "../../assets/clipboard-badge.png";

interface ItemCardProps {
  item: Item;
  owner: User;
  showActions?: boolean;
}

export const ItemCard = ({ item, owner, showActions = true }: ItemCardProps) => {
  console.log("ItemCard item:", item);
  console.log('ItemCard:', JSON.stringify(item, null, 2));
  if (!item || !owner || typeof owner.username !== "string") {
    return <div className="p-4 text-red-500">Invalid item or owner data</div>;
  }
  let timeAgo = "Unknown";
  if (item.postedDate) {
    const date = new Date(item.postedDate);
    if (!isNaN(date.getTime())) {
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    }
  }

  // Get condition color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Like New':
        return 'bg-emerald-100 text-emerald-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden h-full card-shadow">
      <Link to={`/items/${item.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
          <Badge 
            variant="secondary" 
            className={`absolute top-2 right-2 ${getConditionColor(item.condition)}`}
          >
            {item.condition}
          </Badge>
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1 flex items-center gap-1">
                {item.name}
                {item.dropOption === 'send' && (
                  <img src={clipboardBadge} alt="Drop It Off Badge" className="inline-block align-middle h-4 w-4 ml-1" />
                )}
              </h3>
              <p className="text-muted-foreground text-sm">{item.category}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm line-clamp-2 text-gray-600 mb-2">{item.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span>{typeof owner.reputation === "number" ? owner.reputation.toFixed(1) : "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Link to={`/profile/${owner.id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-barter-primary transition-colors flex-1">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{owner.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="truncate">{owner.username}</span>
        </Link>
        
        {showActions && (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/items/${item.id}`}>View Item</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
