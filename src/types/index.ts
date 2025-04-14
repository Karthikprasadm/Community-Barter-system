export interface User {
  id: string;
  username: string;
  email: string;
  reputation: number;
  joinedDate: string;
  profileImage?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface Item {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  isAvailable: boolean;
  postedDate: string;
  imageUrl?: string;
}

export interface Offer {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemOfferedId: string;
  itemRequestedId: string;
  status: 'pending' | 'accepted' | 'rejected';
  offerDate: string;
}

export interface Trade {
  id: string;
  offerId: string;
  tradeDate: string;
  notes?: string;
}

export interface Rating {
  id: string;
  userId: string;
  raterId: string;
  tradeId: string;
  ratingValue: number;
  comment?: string;
  ratingDate: string;
}

export interface ItemWithOwner extends Item {
  owner: User;
}

export interface OfferWithDetails extends Offer {
  fromUser: User;
  toUser: User;
  itemOffered: Item;
  itemRequested: Item;
}

export interface TradeWithDetails extends Trade {
  offer: OfferWithDetails;
}
