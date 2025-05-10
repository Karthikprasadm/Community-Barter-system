import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useBarterContext } from "@/context/BarterContext";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, Edit, MessageSquare, Star, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item } from "@/types";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/ui/ItemCard";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { items, users, currentUser, getItemById, getUserById, createOffer, getUserItems, deleteItem } = useBarterContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  if (!itemId) return <Navigate to="/marketplace" />;
  
  const item = getItemById(itemId);
  if (!item) return <Navigate to="/marketplace" />;
  
  const owner = getUserById(item.userId);
  // If owner is not found, redirect to marketplace
  if (!owner) return <Navigate to="/marketplace" />;
  
  const isOwner = currentUser?.id === owner.id;
  const timeAgo = formatDistanceToNow(new Date(item.postedDate), { addSuffix: true });
  
  const userItems = currentUser ? getUserItems(currentUser.id).filter(item => item.isAvailable) : [];
  
  const canTrade = currentUser && !isOwner && userItems.length > 0 && item.isAvailable;
  
  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedItem) return;
    try {
      console.log("Creating offer with:", {
        fromUserId: currentUser.id,
        toUserId: owner.id,
        itemOfferedId: selectedItem,
        itemRequestedId: item.id
      });
      await createOffer(currentUser.id, owner.id, selectedItem, item.id);
      setTradeDialogOpen(false);
      toast({
        title: "Offer sent",
        description: "Your barter offer has been sent to the owner.",
      });
    } catch (error) {
      toast({
        title: "Offer failed",
        description: "There was a problem sending your offer. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/items/${itemId}/edit`);
  };
  
  const handleDelete = () => {
    deleteItem(itemId);
    navigate("/my-items");
  };
  
  const handleSendMessage = () => {
    if (!currentUser || !message.trim()) return;
    
    // In a real app, this would send the message to a backend
    console.log(`Message from ${currentUser.id} to ${owner.id}: ${message}`);
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${owner.username}.`,
    });
    
    setMessage("");
    setMessageDialogOpen(false);
  };
  
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
  
  // Get other items from the same owner
  const otherItems = getUserItems(owner.id)
    .filter(otherItem => otherItem.id !== item.id && otherItem.isAvailable)
    .slice(0, 4);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          </div>
          
          {/* Item Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold">{item.name}</h1>
                  {item.isAvailable ? (
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Not Available</Badge>
                  )}
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge className="bg-gray-100 text-gray-800">{item.category}</Badge>
                  <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{owner.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{owner.username}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{owner.reputation.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{timeAgo}</span>
                </div>
              </div>
              
              <div className="pt-2">
                {isOwner ? (
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Item</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this item? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message to {owner.username}</DialogTitle>
                          <DialogDescription>
                            Send a message about {item.name} to the owner
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="message">Your message</Label>
                            <Textarea 
                              id="message" 
                              placeholder="I'm interested in this item..." 
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSendMessage}
                              disabled={!message.trim()}
                              className="bg-barter-primary hover:bg-barter-secondary"
                            >
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {canTrade ? (
                      <Dialog open={tradeDialogOpen} onOpenChange={setTradeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-barter-primary hover:bg-barter-secondary">
                            Make Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make a Barter Offer</DialogTitle>
                            <DialogDescription>
                              Select one of your items to offer in exchange for {item.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form onSubmit={handleTrade} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="item-select">Select an item to offer</Label>
                              <Select
                                value={selectedItem}
                                onValueChange={setSelectedItem}
                                required
                              >
                                <SelectTrigger id="item-select">
                                  <SelectValue
                                    placeholder="Choose an item"
                                    children={selectedItem ? userItems.find((u) => String(u.id) === String(selectedItem))?.name : ""}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {userItems.map((userItem) => (
                                    <SelectItem key={userItem.id} value={userItem.id}>
                                      {userItem.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="ghost" onClick={() => setTradeDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                disabled={!selectedItem}
                                className="bg-barter-primary hover:bg-barter-secondary"
                              >
                                Send Offer
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    ) : currentUser && !item.isAvailable ? (
                      <Button disabled className="w-full">
                        Not Available
                      </Button>
                    ) : currentUser && userItems.length === 0 ? (
                      <Button disabled className="w-full" title="You need to add items to your inventory first">
                        No Items to Trade
                      </Button>
                    ) : (
                      <Button className="w-full bg-barter-primary hover:bg-barter-secondary" asChild>
                        <a href="/login">Sign in to Trade</a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Other items from this user */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-barter-primary mb-4">More from {owner.username}</h2>
          
          {otherItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherItems.map((otherItem) => (
                <ItemCard key={otherItem.id} item={otherItem} owner={owner} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No other items available from this user.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItemDetail;
