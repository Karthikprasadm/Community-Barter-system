
import { Item, User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  item: Item;
  owner: User;
  showActions?: boolean;
}

export const ItemCard = ({ item, owner, showActions = true }: ItemCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(item.postedDate), { addSuffix: true });

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
              <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
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
              <span>{owner.reputation.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Link to={`/profile/${owner.id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-barter-primary transition-colors flex-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={owner.profileImage} />
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
