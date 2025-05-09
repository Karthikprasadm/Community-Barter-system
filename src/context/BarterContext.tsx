import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
// API base URL from Vite environment
const apiUrl = import.meta.env.VITE_API_URL;

import { useSocketEvents } from "@/hooks/useSocketEvents";
// // import { users, items, offers, trades, ratings } from "@/data/mockData"; // Removed for backend API // Removed: now using backend API
import { User, Item, Offer, Trade, Rating, OfferWithDetails, ItemWithOwner } from "@/types";
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
  users: User[];
  items: Item[];
  offers: Offer[];
  trades: Trade[];
  ratings: Rating[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  addItem: (item: Omit<Item, "id" | "userId" | "postedDate">) => Promise<void>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  createOffer: (fromUserId: string, toUserId: string, itemOfferedId: string, itemRequestedId: string) => Promise<void>;
  respondToOffer: (offerId: string, accept: boolean) => Promise<void>;
  addRating: (userId: string, raterId: string, tradeId: string, ratingValue: number, comment?: string) => Promise<void>;
  getUserItems: (userId: string) => ItemWithOwner[];
  getItemById: (itemId: string) => Item | undefined;
  getUserById: (userId: string) => User | undefined;
  getPendingOffersForUser: (userId: string) => OfferWithDetails[];
  getUserTrades: (userId: string) => Trade[];
  addUser: (userData: Omit<User, "id" | "joinedDate">) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  addAdminUser: (username: string, email: string) => Promise<void>;
  removeAdminUser: (adminId: string) => Promise<void>;
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

export const BarterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // Real-time updates for items and trades
  useSocketEvents({
    'item:created': (item) => setItems(prev => [...prev, item]),
    'item:updated': (item) => setItems(prev => prev.map(i => i.id === item.id ? item : i)),
    'item:deleted': (item) => setItems(prev => prev.filter(i => i.id !== item.id)),
    'trade:created': (trade) => setTrades(prev => [...prev, trade]),
    'trade:updated': (trade) => setTrades(prev => prev.map(t => t.id === trade.id ? trade : t)),
    'trade:deleted': (trade) => setTrades(prev => prev.filter(t => t.id !== trade.id)),
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isHeadAdmin, setIsHeadAdmin] = useState<boolean>(false);
  const [itemsState, setItems] = useState<Item[]>([]);
  const [offersState, setOffers] = useState<Offer[]>([]);
  const [tradesState, setTrades] = useState<Trade[]>([]);
  const [ratingsState, setRatings] = useState<Rating[]>([]);
  const [usersState, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Fetch all data from backend on mount
  // Utility: safely extract array from API response (handles array or object with key)
  function safeExtractArray<T>(data: any, key: string): T[] {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  }

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Users
    fetch(`${apiUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(safeExtractArray(data, 'users')));
    // Items
    fetch(`${apiUrl}/api/items`)
      .then(res => res.json())
      .then(data => setItems(safeExtractArray(data, 'items')));
    // Offers
    fetch(`${apiUrl}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(safeExtractArray(data, 'offers')));
    // Trades
    fetch(`${apiUrl}/api/trades`)
      .then(res => res.json())
      .then(data => setTrades(safeExtractArray(data, 'trades')));
    // Ratings
    fetch(`${apiUrl}/api/ratings`)
      .then(res => res.json())
      .then(data => setRatings(safeExtractArray(data, 'ratings')));
  }, []);

  // Real-time updates for all entities
  useSocketEvents({
    // Items
    'item:created': (item) => setItems(prev => [...prev, item]),
    'item:updated': (item) => setItems(prev => prev.map(i => i.id === item.id ? item : i)),
    'item:deleted': (item) => setItems(prev => prev.filter(i => i.id !== item.id)),
    // Users
    'user:created': (user) => setUsers(prev => [...prev, user]),
    'user:updated': (user) => setUsers(prev => prev.map(u => u.id === user.id ? user : u)),
    'user:deleted': (user) => setUsers(prev => prev.filter(u => u.id !== user.id)),
    // Trades
    'trade:created': (trade) => setTrades(prev => [...prev, trade]),
    'trade:updated': (trade) => setTrades(prev => prev.map(t => t.id === trade.id ? trade : t)),
    'trade:deleted': (trade) => setTrades(prev => prev.filter(t => t.id !== trade.id)),
    // Offers (future-proof)
    'offer:created': (offer) => setOffers(prev => [...prev, offer]),
    'offer:updated': (offer) => setOffers(prev => prev.map(o => o.id === offer.id ? offer : o)),
    'offer:deleted': (offer) => setOffers(prev => prev.filter(o => o.id !== offer.id)),
    // Ratings (future-proof)
    'rating:created': (rating) => setRatings(prev => [...prev, rating]),
    'rating:updated': (rating) => setRatings(prev => prev.map(r => r.id === rating.id ? rating : r)),
    'rating:deleted': (rating) => setRatings(prev => prev.filter(r => r.id !== rating.id)),
  });

  // CRUD functions using backend API
  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: identifier, email: identifier, password }), credentials: 'include' });
      const result = await res.json();
      // For legacy or new API, support both { user } or user
      const user = result.user || result;
      setCurrentUser(user);
      setIsAdmin(false);
      setIsHeadAdmin(false);
      return true;
    } catch (err) {
      setIsAdmin(false);
      setIsHeadAdmin(false);
      toast({ variant: "destructive", title: "Login failed", description: "Invalid email or password." });
      return false;
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsHeadAdmin(false);
  };

  const adminLogin = async (identifier: string, password: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, email: identifier, password }),
        credentials: 'include',
      });
      const result = await res.json();
      // Accept backend { success: true, user: ... } as a successful login
      if (result && result.success && result.user) {
        setIsAdmin(true);
        setIsHeadAdmin(false); // You may want to enhance this if you have a head admin concept
        return true;
      } else {
        setIsAdmin(false);
        setIsHeadAdmin(false);
        toast({ variant: "destructive", title: "Admin login failed", description: "You do not have admin privileges." });
        return false;
      }
    } catch (err) {
      setIsAdmin(false);
      setIsHeadAdmin(false);
      toast({ variant: "destructive", title: "Admin login failed", description: "Invalid email or password." });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }), credentials: 'include' });
      const user = await res.json();
      setCurrentUser(user);
      return true;
    } catch (err) {
      toast({ variant: "destructive", title: "Registration failed", description: "Email already in use." });
      return false;
    }
  };

  const addItem = async (itemData: Omit<Item, "id" | "userId" | "postedDate">) => {
    if (!currentUser || isAdmin) {
      toast({ variant: "destructive", title: "Add item failed", description: "You must be logged in as a regular user to add items." });
      return;
    }
    // userId must be a number for backend
    const payload = { ...itemData, userId: Number(currentUser.id) };
    const res = await fetch(`${apiUrl}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include', // Ensure session/cookie support
    });
    if (!res.ok) {
      const errorText = await res.text();
      toast({ variant: "destructive", title: "Add item failed", description: `Unable to add item. (${errorText})` });
      return;
    }
    const newItem = await res.json();
    // After adding, fetch latest items from backend to ensure sync
    fetch(`${apiUrl}/api/items`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : (data.items || [])));
    toast({ title: "Item added", description: "The item has been listed successfully." });
  };

  const updateItem = async (updatedItem: Item) => {
    try {
      const res = await fetch(`${apiUrl}/api/items/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem)
      });
      if (!res.ok) {
        const errorText = await res.text();
        toast({ variant: "destructive", title: "Update failed", description: errorText || "Could not update item." });
        return;
      }
      const newItem = await res.json();
      setItems(prev => prev.map(item => item.id === newItem.id ? newItem : item));
      toast({ title: "Item updated", description: "The item has been updated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: "Could not update item due to a network or server error." });
    }
  };

  const deleteItem = async (itemId: string) => {
    let query = "";
    if (isAdmin) {
      query = "?admin=true";
    } else if (currentUser) {
      query = `?userId=${currentUser.id}`;
    }
    const res = await fetch(`${apiUrl}/api/items/${itemId}${query}`, { method: "DELETE" });
    if (!res.ok) {
      const errorText = await res.text();
      toast({ variant: "destructive", title: "Delete failed", description: errorText || "Could not delete item." });
      return;
    }
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item deleted", description: "The item has been removed." });
  };

  const createOffer = async (fromUserId: string, toUserId: string, itemOfferedId: string, itemRequestedId: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId, toUserId, itemOfferedId, itemRequestedId })
      });
      const newOffer = await res.json();
      setOffers(prev => [...prev, newOffer]);
      toast({ title: "Offer sent", description: "Your barter offer has been sent." });
    } catch (err) {
      toast({ variant: "destructive", title: "Offer failed", description: "Could not create offer." });
    }
  };

  const respondToOffer = async (offerId: string, accept: boolean) => {
    try {
      // Update offer status
      const res = await fetch(`${apiUrl}/api/offers/${offerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: accept ? "accepted" : "rejected" })
      });
      const updatedOffer = await res.json();
      setOffers(prev => prev.map(offer => offer.id === offerId ? updatedOffer : offer));

      if (accept) {
        // Create trade if offer accepted
        const tradeRes = await fetch(`${apiUrl}/api/trades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerId })
        });
        const newTrade = await tradeRes.json();
        setTrades(prev => [...prev, newTrade]);
        // Optionally, refresh items from backend to reflect availability
        fetch(`${apiUrl}/api/items`).then(res => res.json()).then(setItems);
        toast({ title: "Offer accepted", description: "The barter has been completed successfully." });
      } else {
        toast({ title: "Offer rejected", description: "The barter offer has been declined." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Offer response failed", description: "Could not respond to offer." });
    }
  };

  const addRating = async (userId: string, raterId: string, tradeId: string, ratingValue: number, comment?: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, raterId, tradeId, ratingValue, comment })
      });
      const newRating = await res.json();
      setRatings(prev => [...prev, newRating]);
      // Optionally, refresh users from backend to reflect updated reputation
      fetch(`${apiUrl}/api/users`).then(res => res.json()).then(setUsers);
      toast({ title: "Rating submitted", description: "Thank you for rating this trade." });
    } catch (err) {
      toast({ variant: "destructive", title: "Rating failed", description: "Could not submit rating." });
    }
  };

  const getUserItems = (userId: string) => {
    return itemsState
      .filter(item => item.userId === userId)
      .map(item => ({
        ...item,
        owner: getUserById(item.userId) || {
          id: item.userId,
          username: "Unknown",
          reputation: 0,
          email: "",
          joinedDate: "",
          profileImage: "",
        },
      }));
  };

  const getItemById = (itemId: string | number) => {
    return itemsState.find(item => String(item.id) === String(itemId));
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

  const addUser = async (userData: Omit<User, "id" | "joinedDate">) => {
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
      reputation: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      ...userData,
    };
    
    const res = await fetch(`${apiUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    const createdUser = await res.json();
    setUsers(prev => [...prev, createdUser]);
    
    // Update activity log
    console.log(`Admin added new user: ${userData.username} at ${new Date().toISOString()}`);
    
    toast({
      title: "User added",
      description: "User has been added.",
    });
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can delete users.",
      });
      return;
    }
    
    await fetch(`${apiUrl}/api/users/${userId}`, { method: "DELETE" });
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Update activity log
    console.log(`Admin deleted user: ${userId} at ${new Date().toISOString()}`);
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully.",
    });
  };

  const updateUser = async (updatedUser: User) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can update users.",
      });
      return;
    }
    
    const res = await fetch(`${apiUrl}/api/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });
    const updatedUserRes = await res.json();
    setUsers(prev => prev.map(user => user.id === updatedUserRes.id ? updatedUserRes : user));
    
    // Update activity log
    console.log(`Admin updated user: ${updatedUser.username} at ${new Date().toISOString()}`);
    
    toast({
      title: "User updated",
      description: "The user has been updated successfully.",
    });
  };

  const addAdminUser = async (username: string, email: string) => {
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
    if (existingUser) {
      toast({
        variant: "destructive",
        title: "Admin creation failed",
        description: "A user with this username or email already exists.",
      });
      return;
    }
    const newAdmin: AdminUser = {
      id: `admin${usersState.length + 1}`,
      username,
      email,
      isHeadAdmin: false,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.username || undefined,
    };
    const res = await fetch(`${apiUrl}/api/admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAdmin)
    });
    const createdAdmin = await res.json();
    setUsers(prev => [...prev, createdAdmin]);
    // Update activity log
    console.log(`New admin user created: ${username} by ${currentUser?.username || "head admin"} at ${new Date().toISOString()}`);
    toast({
      title: "Admin added",
      description: `${username} has been granted admin privileges.`,
    });
  };

  const removeAdminUser = async (adminId: string) => {
    if (!isAdmin || !isHeadAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only the head administrator can remove admin users.",
      });
      return;
    }
    
    await fetch(`${apiUrl}/api/users/${adminId}`, { method: "DELETE" });
    setUsers(prev => prev.filter(user => user.id !== adminId));
    
    // Update activity log
    console.log(`Admin privileges removed: ${adminId} by ${currentUser?.username || "head admin"} at ${new Date().toISOString()}`);
    
    toast({
      title: "Admin removed",
      description: "Admin privileges have been revoked.",
    });
  };

  const getAdminUserById = (adminId: string) => {
    // Find user and ensure it matches AdminUser type
    const user = usersState.find(u => u.id === adminId);
    if (user && 'isHeadAdmin' in user && 'createdAt' in user) {
      return user as AdminUser;
    }
    return undefined;
  };


  const contextValue: BarterContextType = {
    currentUser,
    isAdmin,
    isHeadAdmin,
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
