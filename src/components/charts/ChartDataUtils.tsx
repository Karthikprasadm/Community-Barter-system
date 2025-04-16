
import { User, Item, Trade, Offer } from '@/types';

// Process item categories
export const getCategoryData = (items: Item[]) => {
  const categoryCounts = items.reduce((acc, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCounts)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value); // Sort by highest value first
};

// Trading activity over time
export const getTradeActivityByMonth = (trades: Trade[], offers: Offer[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  const monthlyTradeData = months.map(month => ({
    month,
    trades: 0,
    offers: 0,
  }));
  
  // Count actual trades by month
  trades.forEach(trade => {
    try {
      const tradeDate = new Date(trade.tradeDate);
      // Only count trades from current year
      if (tradeDate.getFullYear() === currentYear) {
        const monthIndex = tradeDate.getMonth();
        monthlyTradeData[monthIndex].trades += 1;
      }
    } catch (e) {
      console.error("Invalid trade date format:", trade.tradeDate);
    }
  });
  
  // Count actual offers by month
  offers.forEach(offer => {
    try {
      const offerDate = new Date(offer.offerDate);
      // Only count offers from current year
      if (offerDate.getFullYear() === currentYear) {
        const monthIndex = offerDate.getMonth();
        monthlyTradeData[monthIndex].offers += 1;
      }
    } catch (e) {
      console.error("Invalid offer date format:", offer.offerDate);
    }
  });
  
  return monthlyTradeData;
};

// User reputation distribution
export const getReputationData = (users: User[]) => {
  const distribution = [
    { name: 'Excellent (4.5-5)', value: users.filter(u => u.reputation >= 4.5).length },
    { name: 'Good (3.5-4.5)', value: users.filter(u => u.reputation >= 3.5 && u.reputation < 4.5).length },
    { name: 'Average (2.5-3.5)', value: users.filter(u => u.reputation >= 2.5 && u.reputation < 3.5).length },
    { name: 'Fair (1.5-2.5)', value: users.filter(u => u.reputation >= 1.5 && u.reputation < 2.5).length },
    { name: 'Poor (0-1.5)', value: users.filter(u => u.reputation < 1.5).length },
  ];
  
  // Filter out categories with zero values
  return distribution.filter(item => item.value > 0);
};

// Item status data
export const getItemStatusData = (items: Item[]) => [
  { name: 'Available', value: items.filter(item => item.isAvailable).length },
  { name: 'Traded/Unavailable', value: items.filter(item => !item.isAvailable).length },
];

// User activity metrics
export const getUserActivityMetrics = (users: User[], items: Item[], trades: Trade[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  const monthlyActivityData = months.map(month => ({
    month,
    users: 0,
    items: 0,
    trades: 0,
  }));
  
  // Count new users by month for current year
  users.forEach(user => {
    try {
      const joinDate = new Date(user.joinedDate);
      if (joinDate.getFullYear() === currentYear) {
        const monthIndex = joinDate.getMonth();
        monthlyActivityData[monthIndex].users += 1;
      }
    } catch (e) {
      console.error("Invalid join date format:", user.joinedDate);
    }
  });
  
  // Count new items by month for current year
  items.forEach(item => {
    try {
      const postedDate = new Date(item.postedDate);
      if (postedDate.getFullYear() === currentYear) {
        const monthIndex = postedDate.getMonth();
        monthlyActivityData[monthIndex].items += 1;
      }
    } catch (e) {
      console.error("Invalid posted date format:", item.postedDate);
    }
  });
  
  // Count trades by month for current year
  trades.forEach(trade => {
    try {
      const tradeDate = new Date(trade.tradeDate);
      if (tradeDate.getFullYear() === currentYear) {
        const monthIndex = tradeDate.getMonth();
        monthlyActivityData[monthIndex].trades += 1;
      }
    } catch (e) {
      console.error("Invalid trade date format:", trade.tradeDate);
    }
  });
  
  return monthlyActivityData;
};
