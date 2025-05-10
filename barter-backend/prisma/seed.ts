/// <reference types="node" />

// prisma/seed.ts
import { PrismaClient, User, Item, Offer, Trade } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Clean up all tables (order matters for FK constraints) ---
  await prisma.rating.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.item.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // --- Admin User ---
  const adminUser = await prisma.user.create({
    data: {
      username: 'wingspawn',
      email: 'wingspawn@admin.com',
      password: 'wingspawn',
      joinedDate: new Date(),
      reputation: 5,
    },
  });
  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      isHeadAdmin: true,
      created_at: new Date(),
    },
  });

  // --- Regular Users ---
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@email.com',
      password: 'alicepw',
      joinedDate: new Date(),
      reputation: 4.2,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@email.com',
      password: 'bobpw',
      joinedDate: new Date(),
      reputation: 3.8,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      username: 'carol',
      email: 'carol@email.com',
      password: 'carolpw',
      joinedDate: new Date(),
      reputation: 2.5,
    },
  });

  // --- Items ---
  const item1 = await prisma.item.create({
    data: {
      name: 'Mountain Bike',
      description: 'A rugged mountain bike, lightly used.',
      category: 'Sports',
      condition: 'Good',
      isAvailable: true,
      userId: user1.id,
    },
  });
  const item2 = await prisma.item.create({
    data: {
      name: 'Electric Guitar',
      description: 'Fender Stratocaster, barely used.',
      category: 'Music',
      condition: 'Like New',
      isAvailable: true,
      userId: user2.id,
    },
  });
  const item3 = await prisma.item.create({
    data: {
      name: 'Cookware Set',
      description: '10-piece non-stick cookware set.',
      category: 'Home',
      condition: 'New',
      isAvailable: false,
      userId: user3.id,
    },
  });
  const item4 = await prisma.item.create({
    data: {
      name: 'Yoga Mat',
      description: 'Premium yoga mat, eco-friendly.',
      category: 'Sports',
      condition: 'Like New',
      isAvailable: true,
      userId: user3.id,
    },
  });

  // --- Items with dropOption: 'send' ---
  await prisma.item.create({
    data: {
      name: 'Seeded Send Item 1',
      description: 'Demo item with dropOption send.',
      category: 'Electronics',
      condition: 'Like New',
      isAvailable: true,
      userId: user1.id,
      dropOption: 'send',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    },
  });
  await prisma.item.create({
    data: {
      name: 'Seeded Send Item 2',
      description: 'Another item with dropOption send.',
      category: 'Books',
      condition: 'Good',
      isAvailable: true,
      userId: user2.id,
      dropOption: 'send',
      imageUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
    },
  });
  await prisma.item.create({
    data: {
      name: 'Seeded Send Item 3',
      description: 'Third item with dropOption send.',
      category: 'Toys',
      condition: 'New',
      isAvailable: true,
      userId: user3.id,
      dropOption: 'send',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    },
  });

  // --- Offers ---
  const offer1 = await prisma.offer.create({
    data: {
      fromUserId: user1.id,
      toUserId: user2.id,
      itemOfferedId: item1.id,
      itemRequestedId: item2.id,
      status: 'pending',
      offerDate: new Date(),
    },
  });
  const offer2 = await prisma.offer.create({
    data: {
      fromUserId: user2.id,
      toUserId: user3.id,
      itemOfferedId: item2.id,
      itemRequestedId: item3.id,
      status: 'accepted',
      offerDate: new Date(),
    },
  });
  const offer3 = await prisma.offer.create({
    data: {
      fromUserId: user3.id,
      toUserId: user1.id,
      itemOfferedId: item3.id,
      itemRequestedId: item1.id,
      status: 'rejected',
      offerDate: new Date(),
    },
  });

  // --- Trades (spread across months) ---
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 15);
  const mar = new Date(now.getFullYear(), 2, 10);
  const may = new Date(now.getFullYear(), 4, 5);

  const trade1 = await prisma.trade.create({
    data: {
      offerId: offer2.id,
      tradeDate: jan,
      notes: 'Smooth and friendly trade!'
    },
  });
  const trade2 = await prisma.trade.create({
    data: {
      offerId: offer1.id,
      tradeDate: mar,
      notes: 'Quick and easy.'
    },
  });
  const trade3 = await prisma.trade.create({
    data: {
      offerId: offer3.id,
      tradeDate: may,
      notes: 'Great communication.'
    },
  });

  // --- Ratings (for all users, mixed values) ---
  await prisma.rating.create({
    data: {
      userId: user2.id,
      raterId: user3.id,
      tradeId: trade1.id,
      ratingValue: 5,
      comment: 'Great experience!'
    },
  });
  await prisma.rating.create({
    data: {
      userId: user3.id,
      raterId: user2.id,
      tradeId: trade1.id,
      ratingValue: 4,
      comment: 'Quick response and easy to work with.'
    },
  });
  await prisma.rating.create({
    data: {
      userId: user1.id,
      raterId: user2.id,
      tradeId: trade2.id,
      ratingValue: 2.5,
      comment: 'Could be better.'
    },
  });
  await prisma.rating.create({
    data: {
      userId: user1.id,
      raterId: user3.id,
      tradeId: trade3.id,
      ratingValue: 3.5,
      comment: 'Average trade.'
    },
  });

  // --- Update items to ensure some are unavailable (traded) ---
  await prisma.item.update({
    where: { id: item1.id },
    data: { isAvailable: false },
  });
  await prisma.item.update({
    where: { id: item2.id },
    data: { isAvailable: false },
  });

  // --- Bulk Users ---
  const bulkUsers: User[] = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@email.com`,
        password: `pass${i}`,
        joinedDate: new Date(),
        reputation: Math.round(Math.random() * 5 * 10) / 10, // 0.0 to 5.0
      },
    });
    bulkUsers.push(user);
  }

  // --- Bulk Items ---
  const bulkItems: Item[] = [];
  for (let i = 1; i <= 20; i++) {
    const item = await prisma.item.create({
      data: {
        name: `Item${i}`,
        description: `Description for Item${i}`,
        category: i % 2 === 0 ? 'Electronics' : 'Books',
        condition: i % 3 === 0 ? 'New' : 'Used',
        isAvailable: i % 2 === 0,
        userId: bulkUsers[i % bulkUsers.length].id,
        dropOption: i <= 12 ? 'send' : undefined, // Only first 12 items get the badge
      },
    });
    bulkItems.push(item);
  }

  // --- Bulk Offers ---
  const bulkOffers: Offer[] = [];
  for (let i = 1; i <= 5; i++) {
    const offer = await prisma.offer.create({
      data: {
        fromUserId: bulkUsers[i % bulkUsers.length].id,
        toUserId: bulkUsers[(i + 1) % bulkUsers.length].id,
        itemOfferedId: bulkItems[i % bulkItems.length].id,
        itemRequestedId: bulkItems[(i + 1) % bulkItems.length].id,
        status: ['pending', 'accepted', 'rejected'][i % 3],
        offerDate: new Date(),
      },
    });
    bulkOffers.push(offer);
  }

  // --- Bulk Trades ---
  const bulkTrades: Trade[] = [];
  for (let i = 0; i < bulkOffers.length; i++) {
    const trade = await prisma.trade.create({
      data: {
        offerId: bulkOffers[i].id,
        tradeDate: new Date(),
        notes: `Trade note ${i + 1}`,
      },
    });
    bulkTrades.push(trade);
  }

  // --- Bulk Ratings ---
  for (let i = 0; i < bulkTrades.length; i++) {
    await prisma.rating.create({
      data: {
        userId: bulkUsers[i % bulkUsers.length].id,
        raterId: bulkUsers[(i + 1) % bulkUsers.length].id,
        tradeId: bulkTrades[i].id,
        ratingValue: Math.floor(Math.random() * 5) + 1,
        comment: `Rating comment ${i + 1}`,
      },
    });
  }

  // --- Bulk Activity Logs ---
  const allTypes = ['LOGIN', 'TRADE', 'OFFER', 'RATING', 'SYSTEM', 'USER', 'ITEM'];
  for (let i = 1; i <= allTypes.length; i++) {
    await prisma.activityLog.create({
      data: {
        timestamp: new Date(Date.now() - i * 86400000), // i days ago
        type: allTypes[i - 1],
        description: `Sample activity log entry #${i}`,
        userId: i,
        username: `user${i}`,
      },
    });
  }

  console.log('Sample data seeded: users, items, offers, trades, ratings, and item status.');
}

main()
  .then(() => {
    console.log('Seeding complete!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Seeding error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
