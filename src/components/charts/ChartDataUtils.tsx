
import { User, Item, Trade, Offer } from '@/types';

// Process item categories
export const getCategoryData = (items: Item[]) => {
  const categoryCounts = items.reduce((acc, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));
};

// Trading activity over time
export const getTradeActivityByMonth = (trades: Trade[], offers: Offer[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTradeData = months.map(month => ({
    month,
    trades: 0,
    offers: 0,
  }));
  
  // Count actual trades by month
  trades.forEach(trade => {
    const tradeDate = new Date(trade.tradeDate);
    const monthIndex = tradeDate.getMonth();
    monthlyTradeData[monthIndex].trades += 1;
  });
  
  // Count actual offers by month
  offers.forEach(offer => {
    const offerDate = new Date(offer.offerDate);
    const monthIndex = offerDate.getMonth();
    monthlyTradeData[monthIndex].offers += 1;
  });
  
  return monthlyTradeData;
};

// User reputation distribution
export const getReputationData = (users: User[]) => [
  { name: 'Excellent (4.5-5)', value: users.filter(u => u.reputation >= 4.5).length },
  { name: 'Good (3.5-4.5)', value: users.filter(u => u.reputation >= 3.5 && u.reputation < 4.5).length },
  { name: 'Average (2.5-3.5)', value: users.filter(u => u.reputation >= 2.5 && u.reputation < 3.5).length },
  { name: 'Fair (1.5-2.5)', value: users.filter(u => u.reputation >= 1.5 && u.reputation < 2.5).length },
  { name: 'Poor (0-1.5)', value: users.filter(u => u.reputation < 1.5).length },
];

// Item status data
export const getItemStatusData = (items: Item[]) => [
  { name: 'Available', value: items.filter(item => item.isAvailable).length },
  { name: 'Traded', value: items.filter(item => !item.isAvailable).length },
];

// User activity metrics
export const getUserActivityMetrics = (users: User[], items: Item[], trades: Trade[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyActivityData = months.map(month => ({
    month,
    users: 0,
    items: 0,
    trades: 0,
  }));
  
  // Count new users by month
  users.forEach(user => {
    const joinDate = new Date(user.joinedDate);
    const monthIndex = joinDate.getMonth();
    monthlyActivityData[monthIndex].users += 1;
  });
  
  // Count new items by month
  items.forEach(item => {
    const postedDate = new Date(item.postedDate);
    const monthIndex = postedDate.getMonth();
    monthlyActivityData[monthIndex].items += 1;
  });
  
  // Count trades by month
  trades.forEach(trade => {
    const tradeDate = new Date(trade.tradeDate);
    const monthIndex = tradeDate.getMonth();
    monthlyActivityData[monthIndex].trades += 1;
  });
  
  return monthlyActivityData;
};
