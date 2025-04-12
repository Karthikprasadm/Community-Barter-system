
import { OfferWithDetails } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightLeft } from "lucide-react";
import { useBarterContext } from "@/context/BarterContext";
import { formatDistanceToNow } from "date-fns";

interface OfferCardProps {
  offer: OfferWithDetails;
}

export const OfferCard = ({ offer }: OfferCardProps) => {
  const { currentUser, respondToOffer } = useBarterContext();
  const isReceived = currentUser?.id === offer.toUserId;
  const timeAgo = formatDistanceToNow(new Date(offer.offerDate), { addSuffix: true });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccept = () => {
    respondToOffer(offer.id, true);
  };

  const handleReject = () => {
    respondToOffer(offer.id, false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={isReceived ? offer.fromUser.profileImage : offer.toUser.profileImage} />
              <AvatarFallback>
                {(isReceived ? offer.fromUser.username : offer.toUser.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">
                {isReceived ? 'Offer from' : 'Offer to'} <span className="font-semibold">{isReceived ? offer.fromUser.username : offer.toUser.username}</span>
              </h3>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <Badge className={getStatusColor(offer.status)}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 rounded-full p-1">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-medium text-sm">{isReceived ? 'You will receive' : 'You offer'}</h4>
            </div>
            <div className="flex gap-3">
              <img 
                src={offer.itemOffered.imageUrl || "/placeholder.svg"} 
                alt={offer.itemOffered.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h5 className="font-medium">{offer.itemOffered.name}</h5>
                <p className="text-xs text-gray-500 line-clamp-2">{offer.itemOffered.description}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-accent/10 rounded-full p-1">
                <ArrowRightLeft className="h-4 w-4 text-accent" />
              </div>
              <h4 className="font-medium text-sm">{isReceived ? 'In exchange for' : 'In exchange for your'}</h4>
            </div>
            <div className="flex gap-3">
              <img 
                src={offer.itemRequested.imageUrl || "/placeholder.svg"} 
                alt={offer.itemRequested.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h5 className="font-medium">{offer.itemRequested.name}</h5>
                <p className="text-xs text-gray-500 line-clamp-2">{offer.itemRequested.description}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {isReceived && offer.status === 'pending' && (
        <CardFooter className="p-4 pt-0 gap-2 justify-end">
          <Button variant="outline" onClick={handleReject}>Decline</Button>
          <Button onClick={handleAccept}>Accept</Button>
        </CardFooter>
      )}
    </Card>
  );
};
