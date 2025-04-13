import React, { createContext, useContext, useState, ReactNode } from "react";
import { users, items, offers, trades, ratings } from "@/data/mockData";
import { User, Item, Offer, Trade, Rating, OfferWithDetails } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { UserReputation } from "@/components/ui/UserReputation";
import { Star } from "lucide-react";

interface BarterContextType {
  currentUser: User | null;
  users: User[];
  items: Item[];
  offers: Offer[];
  trades: Trade[];
  ratings: Rating[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  addItem: (item: Omit<Item, "id" | "userId" | "postedDate">) => void;
  updateItem: (item: Item) => void;
  deleteItem: (itemId: string) => void;
  createOffer: (fromUserId: string, toUserId: string, itemOfferedId: string, itemRequestedId: string) => void;
  respondToOffer: (offerId: string, accept: boolean) => void;
  addRating: (userId: string, raterId: string, tradeId: string, ratingValue: number, comment?: string) => void;
  getUserItems: (userId: string) => Item[];
  getItemById: (itemId: string) => Item | undefined;
  getUserById: (userId: string) => User | undefined;
  getPendingOffersForUser: (userId: string) => OfferWithDetails[];
  getUserTrades: (userId: string) => Trade[];
}

const BarterContext = createContext<BarterContextType | undefined>(undefined);

export const useBarterContext = () => {
  const context = useContext(BarterContext);
  if (!context) {
    throw new Error("useBarterContext must be used within a BarterProvider");
  }
  return context;
};

export const BarterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [itemsState, setItems] = useState<Item[]>(items);
  const [offersState, setOffers] = useState<Offer[]>(offers);
  const [tradesState, setTrades] = useState<Trade[]>(trades);
  const [ratingsState, setRatings] = useState<Rating[]>(ratings);
  const [usersState] = useState<User[]>(users);
  const { toast } = useToast();

  // Sign in a user
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would validate credentials against a backend
    const user = usersState.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "Success",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid email or password",
    });
    return false;
  };

  // Sign out
  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Register a new user
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    if (usersState.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already in use",
      });
      return false;
    }
    
    // In a real app, this would be done on the backend
    const newUser: User = {
      id: `user${usersState.length + 1}`,
      username,
      email,
      reputation: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    // For simplicity in this mock data scenario, we're not adding the user to the state
    // In a real app with a backend, this would add to the database
    
    setCurrentUser(newUser);
    toast({
      title: "Success",
      description: "Your account has been created!",
    });
    return true;
  };

  // Add a new item
  const addItem = (itemData: Omit<Item, "id" | "userId" | "postedDate">) => {
    if (!currentUser) return;
    
    const newItem: Item = {
      id: `item${itemsState.length + 1}`,
      userId: currentUser.id,
      postedDate: new Date().toISOString().split('T')[0],
      ...itemData,
    };
    
    setItems(prev => [...prev, newItem]);
    toast({
      title: "Item added",
      description: "Your item has been listed successfully.",
    });
  };

  // Update an existing item
  const updateItem = (updatedItem: Item) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    toast({
      title: "Item updated",
      description: "Your item has been updated successfully.",
    });
  };

  // Delete an item
  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item deleted",
      description: "Your item has been removed.",
    });
  };

  // Create a new barter offer
  const createOffer = (fromUserId: string, toUserId: string, itemOfferedId: string, itemRequestedId: string) => {
    const newOffer: Offer = {
      id: `offer${offersState.length + 1}`,
      fromUserId,
      toUserId,
      itemOfferedId,
      itemRequestedId,
      status: "pending",
      offerDate: new Date().toISOString().split('T')[0],
    };
    
    setOffers(prev => [...prev, newOffer]);
    toast({
      title: "Offer sent",
      description: "Your barter offer has been sent.",
    });
  };

  // Respond to an offer (accept or reject)
  const respondToOffer = (offerId: string, accept: boolean) => {
    // Update offer status
    setOffers(prev => prev.map(offer => {
      if (offer.id === offerId) {
        return {
          ...offer,
          status: accept ? "accepted" : "rejected",
        };
      }
      return offer;
    }));
    
    // If accepted, create a trade
    if (accept) {
      const acceptedOffer = offersState.find(o => o.id === offerId);
      if (acceptedOffer) {
        const newTrade: Trade = {
          id: `trade${tradesState.length + 1}`,
          offerId,
          tradeDate: new Date().toISOString().split('T')[0],
        };
        
        setTrades(prev => [...prev, newTrade]);
        
        // Update item availability
        setItems(prev => prev.map(item => {
          if (item.id === acceptedOffer.itemOfferedId || item.id === acceptedOffer.itemRequestedId) {
            return {
              ...item,
              isAvailable: false,
            };
          }
          return item;
        }));
        
        toast({
          title: "Offer accepted",
          description: "The barter has been completed successfully.",
        });
      }
    } else {
      toast({
        title: "Offer rejected",
        description: "The barter offer has been declined.",
      });
    }
  };

  // Add a rating after a trade
  const addRating = (userId: string, raterId: string, tradeId: string, ratingValue: number, comment?: string) => {
    const newRating: Rating = {
      id: `rating${ratingsState.length + 1}`,
      userId,
      raterId,
      tradeId,
      ratingValue,
      comment,
      ratingDate: new Date().toISOString().split('T')[0],
    };
    
    // More sophisticated reputation calculation
    const userRatings = ratingsState.filter(rating => rating.userId === userId);
    const totalRatings = userRatings.length + 1;
    const avgRating = (userRatings.reduce((sum, r) => sum + r.ratingValue, 0) + ratingValue) / totalRatings;
    
    // Update user reputation
    const updatedUsers = usersState.map(user => 
      user.id === userId 
        ? { ...user, reputation: Number(avgRating.toFixed(1)) }
        : user
    );
    
    setRatings(prev => [...prev, newRating]);
    
    toast({
      title: "Rating submitted",
      description: "Thank you for rating this trade.",
      icon: <Star className="text-yellow-500" />
    });
  };

  // Get all items for a specific user
  const getUserItems = (userId: string) => {
    return itemsState.filter(item => item.userId === userId);
  };

  // Get item by ID
  const getItemById = (itemId: string) => {
    return itemsState.find(item => item.id === itemId);
  };

  // Get user by ID
  const getUserById = (userId: string) => {
    return usersState.find(user => user.id === userId);
  };

  // Get pending offers for a user (both sent and received)
  const getPendingOffersForUser = (userId: string) => {
    const pendingOffers = offersState.filter(
      offer => (offer.fromUserId === userId || offer.toUserId === userId) && offer.status === "pending"
    );
    
    return pendingOffers.map(offer => {
      const fromUser = getUserById(offer.fromUserId)!;
      const toUser = getUserById(offer.toUserId)!;
      const itemOffered = getItemById(offer.itemOfferedId)!;
      const itemRequested = getItemById(offer.itemRequestedId)!;
      
      return {
        ...offer,
        fromUser,
        toUser,
        itemOffered,
        itemRequested,
      };
    });
  };

  // Get all trades for a user
  const getUserTrades = (userId: string) => {
    const userOfferIds = offersState
      .filter(offer => (offer.fromUserId === userId || offer.toUserId === userId) && offer.status === "accepted")
      .map(offer => offer.id);
    
    return tradesState.filter(trade => userOfferIds.includes(trade.offerId));
  };

  const contextValue: BarterContextType = {
    currentUser,
    users: usersState,
    items: itemsState,
    offers: offersState,
    trades: tradesState,
    ratings: ratingsState,
    login,
    logout,
    register,
    addItem,
    updateItem,
    deleteItem,
    createOffer,
    respondToOffer,
    addRating,
    getUserItems,
    getItemById,
    getUserById,
    getPendingOffersForUser,
    getUserTrades,
  };

  return (
    <BarterContext.Provider value={contextValue}>
      {children}
    </BarterContext.Provider>
  );
};
