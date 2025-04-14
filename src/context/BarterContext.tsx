
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { users, items, offers, trades, ratings } from "@/data/mockData";
import { User, Item, Offer, Trade, Rating, OfferWithDetails } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  isHeadAdmin: boolean;
  createdBy?: string;
  createdAt: string;
}

interface BarterContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isHeadAdmin: boolean;
  adminUsers: AdminUser[];
  users: User[];
  items: Item[];
  offers: Offer[];
  trades: Trade[];
  ratings: Rating[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
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
  addUser: (user: Omit<User, "id" | "joinedDate">) => void;
  deleteUser: (userId: string) => void;
  updateUser: (user: User) => void;
  
  addAdminUser: (username: string, email: string) => void;
  removeAdminUser: (adminId: string) => void;
  getAdminUserById: (adminId: string) => AdminUser | undefined;
}

const BarterContext = createContext<BarterContextType | undefined>(undefined);

export const useBarterContext = () => {
  const context = useContext(BarterContext);
  if (!context) {
    throw new Error("useBarterContext must be used within a BarterProvider");
  }
  return context;
};

// Session storage keys
const SESSION_CURRENT_USER = "barterNexus_currentUser";
const SESSION_IS_ADMIN = "barterNexus_isAdmin";
const SESSION_IS_HEAD_ADMIN = "barterNexus_isHeadAdmin";

export const BarterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isHeadAdmin, setIsHeadAdmin] = useState<boolean>(false);
  const [itemsState, setItems] = useState<Item[]>(items);
  const [offersState, setOffers] = useState<Offer[]>(offers);
  const [tradesState, setTrades] = useState<Trade[]>(trades);
  const [ratingsState, setRatings] = useState<Rating[]>(ratings);
  const [usersState, setUsers] = useState<User[]>(users);
  
  const [adminUsersState, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "admin1",
      username: "wingspawn",
      email: "admin@barternexus.com",
      isHeadAdmin: true,
      createdAt: new Date().toISOString().split('T')[0],
    }
  ]);
  
  const { toast } = useToast();

  // Load session on initial mount
  useEffect(() => {
    const loadSessionData = () => {
      const savedUser = sessionStorage.getItem(SESSION_CURRENT_USER);
      const savedIsAdmin = sessionStorage.getItem(SESSION_IS_ADMIN);
      const savedIsHeadAdmin = sessionStorage.getItem(SESSION_IS_HEAD_ADMIN);
      
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      
      if (savedIsAdmin) {
        setIsAdmin(savedIsAdmin === 'true');
      }
      
      if (savedIsHeadAdmin) {
        setIsHeadAdmin(savedIsHeadAdmin === 'true');
      }
    };
    
    loadSessionData();
  }, []);

  // Save session data when it changes
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(SESSION_CURRENT_USER, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(SESSION_CURRENT_USER);
    }
    
    sessionStorage.setItem(SESSION_IS_ADMIN, String(isAdmin));
    sessionStorage.setItem(SESSION_IS_HEAD_ADMIN, String(isHeadAdmin));
  }, [currentUser, isAdmin, isHeadAdmin]);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = usersState.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAdmin(false);
      setIsHeadAdmin(false);
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

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const adminUser = adminUsersState.find(admin => admin.username === username);
    
    if (adminUser && password === "wingspawn") {
      setIsAdmin(true);
      setIsHeadAdmin(adminUser.isHeadAdmin);
      
      // Update activity log (in a real app, this would be a database call)
      console.log(`Admin login: ${adminUser.username} at ${new Date().toISOString()}`);
      
      const adminUserData: User = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        reputation: 5,
        joinedDate: adminUser.createdAt,
        profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
      };
      setCurrentUser(adminUserData);
      
      toast({
        title: "Admin Access Granted",
        description: adminUser.isHeadAdmin ? "You have head admin privileges." : "You have admin privileges.",
        variant: "default",
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Admin Login Failed",
      description: "Invalid admin credentials",
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsHeadAdmin(false);
    sessionStorage.removeItem(SESSION_CURRENT_USER);
    sessionStorage.removeItem(SESSION_IS_ADMIN);
    sessionStorage.removeItem(SESSION_IS_HEAD_ADMIN);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (usersState.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already in use",
      });
      return false;
    }
    
    const newUser: User = {
      id: `user${usersState.length + 1}`,
      username,
      email,
      reputation: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    
    // Update activity log
    console.log(`New user registered: ${username} at ${new Date().toISOString()}`);
    
    toast({
      title: "Success",
      description: "Your account has been created!",
    });
    return true;
  };

  const addItem = (itemData: Omit<Item, "id" | "userId" | "postedDate">) => {
    if (!currentUser && !isAdmin) return;
    
    const newItem: Item = {
      id: `item${itemsState.length + 1}`,
      userId: currentUser?.id || "admin",
      postedDate: new Date().toISOString().split('T')[0],
      ...itemData,
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Update activity log
    console.log(`New item added: ${itemData.name} by ${currentUser?.username || "admin"} at ${new Date().toISOString()}`);
    
    toast({
      title: "Item added",
      description: "The item has been listed successfully.",
    });
  };

  const updateItem = (updatedItem: Item) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    
    // Update activity log
    console.log(`Item updated: ${updatedItem.name} at ${new Date().toISOString()}`);
    
    toast({
      title: "Item updated",
      description: "The item has been updated successfully.",
    });
  };

  const deleteItem = (itemId: string) => {
    const itemToDelete = itemsState.find(item => item.id === itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
    
    // Update activity log
    console.log(`Item deleted: ${itemToDelete?.name || itemId} at ${new Date().toISOString()}`);
    
    toast({
      title: "Item deleted",
      description: "The item has been removed.",
    });
  };

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
    
    // Update activity log
    console.log(`New offer created: from ${fromUserId} to ${toUserId} at ${new Date().toISOString()}`);
    
    toast({
      title: "Offer sent",
      description: "Your barter offer has been sent.",
    });
  };

  const respondToOffer = (offerId: string, accept: boolean) => {
    setOffers(prev => prev.map(offer => {
      if (offer.id === offerId) {
        return {
          ...offer,
          status: accept ? "accepted" : "rejected",
        };
      }
      return offer;
    }));
    
    if (accept) {
      const acceptedOffer = offersState.find(o => o.id === offerId);
      if (acceptedOffer) {
        const newTrade: Trade = {
          id: `trade${tradesState.length + 1}`,
          offerId,
          tradeDate: new Date().toISOString().split('T')[0],
        };
        
        setTrades(prev => [...prev, newTrade]);
        
        setItems(prev => prev.map(item => {
          if (item.id === acceptedOffer.itemOfferedId || item.id === acceptedOffer.itemRequestedId) {
            return {
              ...item,
              isAvailable: false,
            };
          }
          return item;
        }));
        
        // Update activity log
        console.log(`Offer accepted: ${offerId} at ${new Date().toISOString()}`);
        
        toast({
          title: "Offer accepted",
          description: "The barter has been completed successfully.",
        });
      }
    } else {
      // Update activity log
      console.log(`Offer rejected: ${offerId} at ${new Date().toISOString()}`);
      
      toast({
        title: "Offer rejected",
        description: "The barter offer has been declined.",
      });
    }
  };

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
    
    const userRatings = ratingsState.filter(rating => rating.userId === userId);
    const totalRatings = userRatings.length + 1;
    const avgRating = (userRatings.reduce((sum, r) => sum + r.ratingValue, 0) + ratingValue) / totalRatings;
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, reputation: Number(avgRating.toFixed(1)) }
        : user
    ));
    
    setRatings(prev => [...prev, newRating]);
    
    // Update activity log
    console.log(`New rating added: ${ratingValue}/5 for user ${userId} by ${raterId} at ${new Date().toISOString()}`);
    
    toast({
      title: "Rating submitted",
      description: "Thank you for rating this trade.",
    });
  };

  const getUserItems = (userId: string) => {
    return itemsState.filter(item => item.userId === userId);
  };

  const getItemById = (itemId: string) => {
    return itemsState.find(item => item.id === itemId);
  };

  const getUserById = (userId: string) => {
    return usersState.find(user => user.id === userId);
  };

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

  const getUserTrades = (userId: string) => {
    const userOfferIds = offersState
      .filter(offer => (offer.fromUserId === userId || offer.toUserId === userId) && offer.status === "accepted")
      .map(offer => offer.id);
    
    return tradesState.filter(trade => userOfferIds.includes(trade.offerId));
  };

  const addUser = (userData: Omit<User, "id" | "joinedDate">) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can add users.",
      });
      return;
    }
    
    const newUser: User = {
      id: `user${usersState.length + 1}`,
      joinedDate: new Date().toISOString().split('T')[0],
      ...userData,
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // Update activity log
    console.log(`Admin added new user: ${userData.username} at ${new Date().toISOString()}`);
    
    toast({
      title: "User added",
      description: "The user has been added successfully.",
    });
  };

  const deleteUser = (userId: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can delete users.",
      });
      return;
    }
    
    const userToDelete = usersState.find(user => user.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Update activity log
    console.log(`Admin deleted user: ${userToDelete?.username || userId} at ${new Date().toISOString()}`);
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully.",
    });
  };

  const updateUser = (updatedUser: User) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can update users.",
      });
      return;
    }
    
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    
    // Update activity log
    console.log(`Admin updated user: ${updatedUser.username} at ${new Date().toISOString()}`);
    
    toast({
      title: "User updated",
      description: "The user has been updated successfully.",
    });
  };

  const addAdminUser = (username: string, email: string) => {
    if (!isAdmin || !isHeadAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only the head administrator can create new admin users.",
      });
      return;
    }
    
    // Check if this is an existing user first
    const existingUser = usersState.find(user => user.username === username || user.email === email);
    
    if (adminUsersState.some(admin => admin.username === username || admin.email === email)) {
      toast({
        variant: "destructive",
        title: "Admin creation failed",
        description: "An admin with this username or email already exists.",
      });
      return;
    }
    
    const newAdmin: AdminUser = {
      id: `admin${adminUsersState.length + 1}`,
      username,
      email,
      isHeadAdmin: false,
      createdBy: currentUser?.username,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setAdminUsers(prev => [...prev, newAdmin]);
    
    // Update activity log
    console.log(`New admin user created: ${username} by ${currentUser?.username || "head admin"} at ${new Date().toISOString()}`);
    
    toast({
      title: "Admin added",
      description: `${username} has been granted admin privileges.`,
    });
  };

  const removeAdminUser = (adminId: string) => {
    if (!isAdmin || !isHeadAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only the head administrator can remove admin users.",
      });
      return;
    }
    
    const adminToRemove = adminUsersState.find(admin => admin.id === adminId);
    if (adminToRemove?.isHeadAdmin) {
      toast({
        variant: "destructive",
        title: "Cannot remove head admin",
        description: "The head administrator cannot be removed.",
      });
      return;
    }
    
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
    
    // Update activity log
    console.log(`Admin privileges removed: ${adminToRemove?.username || adminId} by ${currentUser?.username || "head admin"} at ${new Date().toISOString()}`);
    
    toast({
      title: "Admin removed",
      description: "Admin privileges have been revoked.",
    });
  };

  const getAdminUserById = (adminId: string) => {
    return adminUsersState.find(admin => admin.id === adminId);
  };

  const contextValue: BarterContextType = {
    currentUser,
    isAdmin,
    isHeadAdmin,
    adminUsers: adminUsersState,
    users: usersState,
    items: itemsState,
    offers: offersState,
    trades: tradesState,
    ratings: ratingsState,
    login,
    logout,
    adminLogin,
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
    addUser,
    deleteUser,
    updateUser,
    addAdminUser,
    removeAdminUser,
    getAdminUserById,
  };

  return (
    <BarterContext.Provider value={contextValue}>
      {children}
    </BarterContext.Provider>
  );
};
