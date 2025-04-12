
import { User, Item, Offer, Trade, Rating } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "user1",
    username: "john_doe",
    email: "john@example.com",
    reputation: 4.8,
    joinedDate: "2023-01-15",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
  },
  {
    id: "user2",
    username: "jane_smith",
    email: "jane@example.com",
    reputation: 4.5,
    joinedDate: "2023-02-20",
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  },
  {
    id: "user3",
    username: "alex_wilson",
    email: "alex@example.com",
    reputation: 4.2,
    joinedDate: "2023-03-10",
    profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
  },
  {
    id: "user4",
    username: "sam_taylor",
    email: "sam@example.com",
    reputation: 4.9,
    joinedDate: "2023-01-05",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  }
];

// Mock Items
export const items: Item[] = [
  {
    id: "item1",
    userId: "user1",
    name: "Vintage Camera",
    description: "A well-maintained vintage film camera from the 1970s.",
    category: "Electronics",
    condition: "Good",
    isAvailable: true,
    postedDate: "2023-04-10",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
  },
  {
    id: "item2",
    userId: "user1",
    name: "Hiking Boots",
    description: "Men's size 10 hiking boots, used for one season.",
    category: "Clothing",
    condition: "Like New",
    isAvailable: true,
    postedDate: "2023-04-15",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
  },
  {
    id: "item3",
    userId: "user2",
    name: "Ceramic Plant Pot",
    description: "Handmade ceramic pot perfect for indoor plants.",
    category: "Home",
    condition: "New",
    isAvailable: true,
    postedDate: "2023-04-20",
    imageUrl: "https://images.unsplash.com/photo-1618744346372-ce81224a49ac"
  },
  {
    id: "item4",
    userId: "user2",
    name: "Yoga Mat",
    description: "Premium non-slip yoga mat, 6mm thickness.",
    category: "Sports",
    condition: "Good",
    isAvailable: true,
    postedDate: "2023-04-18",
    imageUrl: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
  },
  {
    id: "item5",
    userId: "user3",
    name: "Fiction Book Collection",
    description: "Collection of 5 bestselling fiction novels.",
    category: "Books",
    condition: "Good",
    isAvailable: true,
    postedDate: "2023-04-12",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794"
  },
  {
    id: "item6",
    userId: "user3",
    name: "Coffee Maker",
    description: "Programmable drip coffee maker, 12-cup capacity.",
    category: "Appliances",
    condition: "Like New",
    isAvailable: true,
    postedDate: "2023-04-08",
    imageUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56"
  },
  {
    id: "item7",
    userId: "user4",
    name: "Mountain Bike",
    description: "Adult mountain bike, 21-speed, front suspension.",
    category: "Sports",
    condition: "Good",
    isAvailable: true,
    postedDate: "2023-04-05",
    imageUrl: "https://images.unsplash.com/photo-1511994298241-608e28f14fde"
  },
  {
    id: "item8",
    userId: "user4",
    name: "Tool Set",
    description: "130-piece household tool set with carrying case.",
    category: "Tools",
    condition: "Like New",
    isAvailable: true,
    postedDate: "2023-04-02",
    imageUrl: "https://images.unsplash.com/photo-1581147036324-c71f53e395d5"
  }
];

// Mock Offers
export const offers: Offer[] = [
  {
    id: "offer1",
    fromUserId: "user1",
    toUserId: "user3",
    itemOfferedId: "item1",
    itemRequestedId: "item5",
    status: "pending",
    offerDate: "2023-05-01"
  },
  {
    id: "offer2",
    fromUserId: "user2",
    toUserId: "user4",
    itemOfferedId: "item3",
    itemRequestedId: "item8",
    status: "accepted",
    offerDate: "2023-04-28"
  },
  {
    id: "offer3",
    fromUserId: "user3",
    toUserId: "user2",
    itemOfferedId: "item6",
    itemRequestedId: "item4",
    status: "rejected",
    offerDate: "2023-04-25"
  }
];

// Mock Trades (from accepted offers)
export const trades: Trade[] = [
  {
    id: "trade1",
    offerId: "offer2",
    tradeDate: "2023-04-30",
    notes: "Met at the community center for exchange."
  }
];

// Mock Ratings
export const ratings: Rating[] = [
  {
    id: "rating1",
    userId: "user4", // user being rated
    raterId: "user2", // user giving the rating
    tradeId: "trade1",
    ratingValue: 5,
    comment: "Great item, exactly as described. Pleasant transaction.",
    ratingDate: "2023-05-01"
  },
  {
    id: "rating2",
    userId: "user2", // user being rated
    raterId: "user4", // user giving the rating
    tradeId: "trade1",
    ratingValue: 4,
    comment: "Good transaction. Item was in slightly better condition than expected.",
    ratingDate: "2023-05-01"
  }
];

// Category options for items
export const categories = [
  "Electronics",
  "Clothing",
  "Home",
  "Sports",
  "Books",
  "Appliances",
  "Tools",
  "Music",
  "Art",
  "Furniture",
  "Garden",
  "Toys",
  "Other"
];

// Condition options for items
export const conditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor"
];
