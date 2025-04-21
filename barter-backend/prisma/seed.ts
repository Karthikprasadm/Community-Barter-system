// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

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
