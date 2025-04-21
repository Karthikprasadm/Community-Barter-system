import dotenv from "dotenv";
dotenv.config();
import { toISTString } from "./utils/date";
import http from "http";
import app from "./app";
import setupWebSocket from "./websocket";
import { Client as PgClient } from "pg";
import { PrismaClient } from "@prisma/client";

// Instantiate Prisma Client
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Create HTTP server for both Express and WebSocket
const server = http.createServer(app);
// Setup WebSocket
const { broadcastUpdate, broadcastActivityLogUpdate } = setupWebSocket(app, server);
import { setBroadcastActivityLogUpdate, setBroadcastUpdate } from './app';
setBroadcastActivityLogUpdate(broadcastActivityLogUpdate);
setBroadcastUpdate(broadcastUpdate);
console.log('[SOCKET DEBUG] broadcastUpdate injected into app.');

// --- PostgreSQL LISTEN/NOTIFY bridge for real-time sync ---
const pgClient = new PgClient({ connectionString: process.env.DATABASE_URL });
pgClient.connect();
[
  "item_changes",
  "user_changes",
  "trade_changes",
  "offer_changes",
  "rating_changes",
].forEach((channel) => {
  pgClient.query(`LISTEN ${channel}`);
});
// Type for pg notification message
interface PgNotificationMsg {
  channel: string;
  payload?: string;
}

pgClient.on("notification", async (msg: PgNotificationMsg) => {
  try {
    if (!msg.payload) {
      console.error(
        `[PG NOTIFY ERROR] Missing payload for channel ${msg.channel}`,
      );
      return;
    }
    let operation: string, data: Record<string, unknown>;
    try {
      ({ operation, data } = JSON.parse(msg.payload));
    } catch (parseErr: unknown) {
      console.error(
        `[PG NOTIFY ERROR] Failed to parse payload for channel ${msg.channel}:`,
        msg.payload,
        parseErr,
      );
      return;
    }
    switch (msg.channel) {
      case "item_changes":
        broadcastUpdate(`item:${operation.toLowerCase()}`, data);
        break;
      case "user_changes":
        broadcastUpdate(`user:${operation.toLowerCase()}`, data);
        break;
      case "trade_changes":
        broadcastUpdate(`trade:${operation.toLowerCase()}`, data);
        break;
      case "offer_changes":
        broadcastUpdate(`offer:${operation.toLowerCase()}`, data);
        break;
      case "rating_changes":
        broadcastUpdate(`rating:${operation.toLowerCase()}`, data);
        break;
    }
  } catch (err) {
    console.error("[PG NOTIFY ERROR]", err);
  }
});
// Database connection resilience: handle errors and optionally reconnect
pgClient.on("error", (err: Error) => {
  console.error("Postgres connection error:", err);
  // Optionally, implement reconnection logic here if needed
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

// --- ITEMS ---
app.get("/api/items", async (req, res) => {
  const items = await prisma.item.findMany({
    include: { user: true, offers: true, requestedInOffers: true },
  });
  // Add IST conversion for createdAt (and updatedAt if present)
  res.json(
    items.map((item: any) => ({
      ...item,
      createdAtIST:
        "createdAt" in item && item.createdAt
          ? toISTString(item.createdAt)
          : undefined,
      updatedAtIST:
        "updatedAt" in item && item.updatedAt
          ? toISTString(item.updatedAt)
          : undefined,
    })),
  );
});

app.post("/api/items", async (req, res) => {
  const { name, description, category, condition, userId } = req.body;
  const item = await prisma.item.create({
    data: { name, description, category, condition, userId: Number(userId) },
  });
  // Real-time update: broadcast new item (emit BEFORE responding)
  console.log('[SOCKET DEBUG] About to emit item:created event:', item);
  broadcastUpdate("item:created", item);
  console.log('[SOCKET DEBUG] Emitted item:created event:', item);
  res.json(item);
});

app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, category, condition } = req.body;
  try {
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: { name, description, category, condition },
    });
    res.json(updatedItem);
    broadcastUpdate("item:updated", updatedItem);
  } catch (error) {
    res.status(404).json({ error: "Item not found" });
  }
});

// --- OFFERS ---
app.get("/api/offers", async (req, res) => {
  const offers = await prisma.offer.findMany({
    include: {
      fromUser: true,
      toUser: true,
      itemOffered: true,
      itemRequested: true,
      trade: true,
    },
  });
  // Add IST conversion for offerDate
  res.json(
    offers.map((offer: any) => ({
      ...offer,
      offerDateIST:
        "offerDate" in offer && offer.offerDate
          ? toISTString(offer.offerDate)
          : undefined,
    })),
  );
});

app.post("/api/offers", async (req, res) => {
  const { fromUserId, toUserId, itemOfferedId, itemRequestedId, status } =
    req.body;
  const offer = await prisma.offer.create({
    data: { fromUserId, toUserId, itemOfferedId, itemRequestedId, status },
  });
  res.json(offer);
});

// --- TRADES ---
app.get("/api/trades", async (req, res) => {
  const trades = await prisma.trade.findMany({
    include: { offer: true, ratings: true },
  });
  // Add IST conversion for tradeDate (if present)
  res.json(
    trades.map((trade: any) => ({
      ...trade,
      tradeDateIST:
        "tradeDate" in trade && trade.tradeDate
          ? toISTString(trade.tradeDate)
          : undefined,
    })),
  );
});

app.post("/api/trades", async (req, res) => {
  const { offerId, notes } = req.body;
  const trade = await prisma.trade.create({
    data: { offerId, notes },
  });
  res.json(trade);
  // Real-time update: broadcast new trade
  broadcastUpdate("trade:created", trade);
});

// --- RATINGS ---
app.post("/api/ratings", async (req, res) => {
  const { userId, raterId, tradeId, ratingValue, comment } = req.body;
  const rating = await prisma.rating.create({
    data: { userId, raterId, tradeId, ratingValue, comment },
  });
  res.json(rating);
});

// --- USER LOGIN ---
app.post("/api/login", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Find user with matching username OR email and password
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { password },
          {
            // Use a local type to satisfy TypeScript
            OR: [
              username ? { username } : undefined,
              email ? { email } : undefined,
            ].filter(Boolean) as { username?: string; email?: string }[],
          },
        ],
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    return res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[LOGIN ERROR]", message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: message });
  }
});

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.send("BarterNexus API is running!");
});

// REMOVED DUPLICATE LISTEN CALL
// const PORT = process.env.PORT || 15000;
// app.listen(PORT, () => {
//   console.log(`Backend API running on http://localhost:${PORT}`);
// });

export default app;
