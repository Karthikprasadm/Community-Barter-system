console.log("[DEBUG] app.ts loaded at", new Date().toISOString());
console.log("[DEBUG] NODE_ENV:", process.env.NODE_ENV);
console.log("[DEBUG] process.env loaded:", Object.keys(process.env));

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Prisma, PrismaClient } from "@prisma/client";
import setupWebSocket from "./websocket";

// --- WebSocket Broadcast Update Injection ---
let broadcastUpdate: ((event: string, data: unknown) => void) | undefined = undefined;
export function setBroadcastUpdate(fn: typeof broadcastUpdate) {
  broadcastUpdate = fn;
}

import type { ActivityLog } from "@prisma/client";

// --- Express App Setup ---
const app = express();

// --- Robust CORS Middleware ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow all localhost and 127.0.0.1 ports for frontend dev
    if (
      !origin ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  preflightContinue: false,
}));
app.use(express.json());
app.use(cookieParser());

// --- Security and Cache Headers Middleware ---
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('X-Frame-Options');
  // Optionally set Content-Security-Policy for frame-ancestors
  // res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  next();
});

// --- Require Admin Session Middleware ---
function requireAdminSession(req: Request, res: Response, next: NextFunction) {
  // For demo: check for a cookie called 'admin_session' (could be JWT or user id)
  if (req.cookies && req.cookies.admin_session) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Admin session required" });
}

// --- ADMIN LOGIN ENDPOINT (robust, demo-friendly) ---
app.post("/api/admin-login", async (req: Request, res: Response) => {
  const { username, email, password }: { username?: string; email?: string; password?: string } = req.body;
  console.log("[ADMIN LOGIN DEBUG] Incoming payload:", req.body);

  // --- Input validation ---
  if (!username && !email) {
    return res.status(400).json({ success: false, message: "Username or email is required" });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
  }

  try {
    // Find user with matching username OR email (case-insensitive) and password (case-sensitive)
    const users = await prisma.user.findMany();
    const admins = await prisma.admin.findMany();
    console.log("[ADMIN LOGIN DEBUG] All users:", users);
    console.log("[ADMIN LOGIN DEBUG] All admins:", admins);
    const user = users.find(
      u =>
        u.password === password &&
        (
          (username && u.username.toLowerCase() === username.toLowerCase()) ||
          (email && u.email.toLowerCase() === email.toLowerCase())
        )
    );
    console.log("[ADMIN LOGIN DEBUG] User found:", user);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    // Check if user is admin
    const admin = admins.find(a => a.userId === user.id);
    console.log("[ADMIN LOGIN DEBUG] Admin found:", admin);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Not an admin user" });
    }
    // Set admin_session cookie (for demo, just user id; in production use JWT)
    res.cookie("admin_session", user.id, {
      httpOnly: true,
      sameSite: "none", // Changed from 'lax' to 'none' for cross-origin support
      secure: false, // Remain false for local HTTP development
      path: "/",
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    });
    console.log("[ADMIN LOGIN] Set-Cookie: admin_session=", user.id);
    return res.json({
      success: true,
      message: "Admin login successful",
      user: { id: user.id, username: user.username, email: user.email },
      admin
    });
  } catch (err) {
    console.error("[ADMIN LOGIN DEBUG] Error during admin login:", err);
    res.status(500).json({ success: false, message: "Admin login failed", details: err });
  }
});

// --- Prisma Client ---
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
export { prisma };

export let broadcastActivityLogUpdate: ((entry: ActivityLog) => void) | undefined = undefined;
export function setBroadcastActivityLogUpdate(fn: (entry: ActivityLog) => void) {
  broadcastActivityLogUpdate = fn;
}

// --- ACTIVITY LOG ENDPOINTS ---
app.get("/api/activity-log", requireAdminSession, async (req: Request, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    console.log("[DEBUG] Activity logs found:", logs);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity logs", details: err });
  }
});

// POST /api/activity-log - for compatibility with WebSocket tests
app.post("/api/activity-log", requireAdminSession, async (req: Request, res: Response) => {
  try {
    const { type, description, userId, username } = req.body;
    console.log('[DEBUG] /api/activity-log payload:', { type, description, userId, username });
    // Pass app instance for test compatibility
    const entry = await logActivity({ type, description, userId, username, appInstance: req.app });
    console.log('[DEBUG] /api/activity-log created entry:', entry);
    // Force emit activity_log_update here for test/dev reliability
    const wsFn = req.app.get('broadcastActivityLogUpdate');
    if (typeof wsFn === 'function') {
      console.log('[DEBUG] /api/activity-log emitting activity_log_update via app.get');
      wsFn(entry);
    } else {
      console.warn('[DEBUG] /api/activity-log: No broadcastActivityLogUpdate found on app');
    }
    res.status(201).json(entry);
  } catch (err) {
    console.error('[DEBUG] /api/activity-log error:', err);
    res.status(400).json({ error: "Failed to log activity", details: err });
  }
});

app.post("/api/activity-log/clear", requireAdminSession, async (req: Request, res: Response) => {
  try {
    await prisma.activityLog.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear activity logs", details: err });
  }
});

// Utility to log a new activity (to be used in other routes)
export async function logActivity({ type, description, userId, username, appInstance }: {
  type: string;
  description: string;
  userId?: number;
  username?: string;
  appInstance?: any;
}) {
  const entry = await prisma.activityLog.create({
    data: { type, description, userId, username },
  });
  // Emit real-time event if available (test and prod compatible)
  let broadcastFn = broadcastActivityLogUpdate;
  if (appInstance && typeof appInstance.get === 'function') {
    const wsFn = appInstance.get('broadcastActivityLogUpdate');
    if (typeof wsFn === 'function') broadcastFn = wsFn;
  }
  console.log('[DEBUG] logActivity about to emit activity_log_update:', { entry, broadcastFnType: typeof broadcastFn });
  if (broadcastFn) {
    broadcastFn(entry);
    console.log('[DEBUG] logActivity emitted activity_log_update event');
  } else {
    console.warn('[DEBUG] logActivity: No broadcastFn for activity_log_update');
  }
  return entry;
}

// Performance profiling middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[PROFILE] ${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

// --- ADVANCED SQL DEMO ENDPOINTS ---
// 1. JOIN: Get all items with owner's username
app.get("/api/items-with-owners", async (req: Request, res: Response) => {
  const result =
    await prisma.$queryRaw`SELECT i.*, u.username AS owner_username FROM "Item" i JOIN "User" u ON i."userId" = u.id`;
  res.json(result);
});

// 2. VIEW: Get all trade details (requires trade_details view)
app.get("/api/trade-details", async (req: Request, res: Response) => {
  const result = await prisma.$queryRaw`SELECT * FROM trade_details`;
  res.json(result);
});

// 3. TRANSACTION: Accept offer and create trade atomically
app.post("/api/accept-offer-transaction", async (req: Request, res: Response) => {
  const { offerId }: { offerId: number } = req.body;
  const result = await prisma.$transaction([
    prisma.$executeRaw`UPDATE "Offer" SET status = 'accepted' WHERE id = ${offerId}`,
    prisma.$executeRaw`INSERT INTO "Trade" ("offerId") VALUES (${offerId})`,
  ]);
  // Log activity
  await logActivity({
    type: "trade",
    description: `Trade completed for offer ${offerId}`,
  });
  res.json({ success: true, result });
});

// --- USERS CRUD ---
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { username, email, password }: { username: string; email: string; password: string } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    // Log activity
    await logActivity({
      type: "user",
      description: `New user registered: ${username}`,
      userId: user.id,
      username: user.username,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User creation failed", details: err });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({ where: { id: Number(id) } });
    res.json(deletedUser);
  } catch (err) {
    res.status(404).json({ error: "User not found", details: err });
  }
});

// --- ITEMS CRUD ---
// BULK DELETE ITEMS
// BULK UPDATE ITEMS
app.put("/api/items/bulk", async (req: Request, res: Response) => {
  const { updates }: { updates: { id: number; [key: string]: unknown }[] } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "No item updates provided" });
  }
  let updatedCount = 0;
  try {
    for (const update of updates) {
      const { id, ...data } = update;
      if (!id) continue;
      const result = await prisma.item.update({
        where: { id: Number(id) },
        data,
      });
      if (result) updatedCount += 1;
    }
    res.json({ updatedCount });
  } catch (err) {
    res.status(400).json({ error: "Bulk item update failed", details: err });
  }
});
app.delete("/api/items/bulk", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No item IDs provided" });
  }
  try {
    const result = await prisma.item.deleteMany({
      where: { id: { in: ids.map(Number) } },
    });
    res.json({ deletedCount: result.count });
  } catch (err) {
    res.status(400).json({ error: "Bulk item deletion failed", details: err });
  }
});
app.get("/api/items", async (req: Request, res: Response) => {
  const items = await prisma.item.findMany({
    include: { user: true },
  });
  res.json(items);
});

// --- ADVANCED SEARCH/FILTER FOR ITEMS ---

// PUT /api/items/:id - Update an item by ID
app.put("/api/items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: updateData,
    });
    // Emit WebSocket event if broadcastUpdate is set (for tests and production)
    if (typeof res.app.get === "function") {
      const broadcastUpdate = res.app.get("broadcastUpdate");
      if (typeof broadcastUpdate === "function") {
        broadcastUpdate("item:updated", item);
      }
    }
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: "Item not found or update failed", details: err });
  }
});

app.get("/api/items/search", async (req: Request, res: Response) => {
  const { name, category, condition, userId, q } = req.query;
  const where: any = {};

  if (name) where.name = { contains: String(name), mode: "insensitive" };
  if (category) where.category = { contains: String(category), mode: "insensitive" };
  if (condition) where.condition = { equals: String(condition) };
  if (userId) where.userId = Number(userId);
  if (q) {
    where.OR = [
      { name: { contains: String(q), mode: "insensitive" } },
      { description: { contains: String(q), mode: "insensitive" } },
      { category: { contains: String(q), mode: "insensitive" } },
    ];
  }

  try {
    const items = await prisma.item.findMany({ where });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: "Search failed", details: err });
  }
});

// --- ADVANCED SEARCH/FILTER FOR USERS ---
app.get("/api/users/search", async (req: Request, res: Response) => {
  const { username, email, q } = req.query;
  const where: any = {};

  if (username) where.username = { contains: String(username), mode: "insensitive" };
  if (email) where.email = { contains: String(email), mode: "insensitive" };
  if (q) {
    where.OR = [
      { username: { contains: String(q), mode: "insensitive" } },
      { email: { contains: String(q), mode: "insensitive" } },
    ];
  }

  try {
    const users = await prisma.user.findMany({ where });
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: "User search failed", details: err });
  }
});

app.post("/api/items", async (req: Request, res: Response) => {
  const { name, description, category, condition, userId, imageUrl } = req.body;
  console.log("[ITEM CREATE DEBUG] Incoming payload:", req.body);
  if (!name || !description || !category || !condition || !userId) {
    console.log("[ITEM CREATE DEBUG] Missing required fields:", { name, description, category, condition, userId });
    return res.status(400).json({ error: "Missing required fields for item creation.", details: { name, description, category, condition, userId } });
  }
  try {
    const item = await prisma.item.create({
      data: { name, description, category, condition, userId: Number(userId), imageUrl },
    });
    console.log("[ITEM CREATE DEBUG] Item created:", item.id);
    // Emit WebSocket event if broadcastUpdate is set
    if (typeof broadcastUpdate === "function") {
      console.log('[SOCKET DEBUG] About to emit item:created event:', item);
      broadcastUpdate("item:created", item);
      console.log('[SOCKET DEBUG] Emitted item:created event:', item);
    } else {
      console.error('[SOCKET DEBUG] broadcastUpdate is not set! Printing stack trace for diagnosis:');
      console.trace();
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: "Item creation failed", details: err });
  }
});

app.delete("/api/items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // Accept userId from either body or query for compatibility
  const userId = req.body.userId || req.query.userId;
  // Accept admin bypass (admin=true in query)
  const isAdmin = req.body.admin === true || req.query.admin === 'true';
  if (!userId && !isAdmin) {
    return res.status(401).json({ error: "User ID required for deletion or admin override" });
  }
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(id) } });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (!isAdmin && item.userId !== Number(userId)) {
      return res.status(403).json({ error: "You do not have permission to delete this item" });
    }
    const deletedItem = await prisma.item.delete({ where: { id: Number(id) } });
    // Emit WebSocket event if broadcastUpdate is set (for tests and production)
    if (typeof res.app.get === "function") {
      const broadcastUpdate = res.app.get("broadcastUpdate");
      if (typeof broadcastUpdate === "function") {
        broadcastUpdate("item:deleted", deletedItem);
      }
    }
    res.json(deletedItem);
  } catch (err) {
    res.status(400).json({ error: "Item deletion failed", details: err });
  }
});

// --- LOGIN ENDPOINT (for demonstration) ---
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, email, password }: { username: string; email: string; password: string } = req.body;
  console.log("[LOGIN DEBUG] Incoming payload:", req.body);
  // Print all users for debugging
  const allUsers = await prisma.user.findMany();
  console.log("[LOGIN DEBUG] All users in DB:", allUsers);
  try {
    // Find user with matching username OR email and password
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { password },
          {
            OR: [
              { username: { equals: username, mode: "insensitive" } },
              { email: { equals: email, mode: "insensitive" } },
            ],
          },
        ],
      },
    });
    console.log("[LOGIN DEBUG] User found:", user);
    if (!user) {
      console.log("[LOGIN DEBUG] No matching user found for:", { username, email });
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ user });
  } catch (err) {
    console.error("[LOGIN DEBUG] Error during login:", err);
    res.status(400).json({ error: "Login failed", details: err });
  }
});

// --- OFFERS CRUD ---
// BULK DELETE OFFERS
// BULK UPDATE OFFERS
app.put("/api/offers/bulk", async (req: Request, res: Response) => {
  const { updates }: { updates: { id: number; [key: string]: any }[] } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "No offer updates provided" });
  }
  let updatedCount = 0;
  try {
    for (const update of updates) {
      const { id, ...data } = update;
      if (!id) continue;
      const result = await prisma.offer.update({
        where: { id: Number(id) },
        data,
      });
      if (result) updatedCount += 1;
    }
    res.json({ updatedCount });
  } catch (err) {
    res.status(400).json({ error: "Bulk offer update failed", details: err });
  }
});
app.delete("/api/offers/bulk", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No offer IDs provided" });
  }
  try {
    const result = await prisma.offer.deleteMany({
      where: { id: { in: ids.map(Number) } },
    });
    res.json({ deletedCount: result.count });
  } catch (err) {
    res.status(400).json({ error: "Bulk offer deletion failed", details: err });
  }
});
app.get("/api/offers", async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        fromUser: true,
        toUser: true,
        itemOffered: true,
        itemRequested: true,
        trade: true,
      },
    });
    res.json(offers);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch offers", details: err });
  }
});

app.post("/api/offers", async (req: Request, res: Response) => {
  const { fromUserId, toUserId, itemOfferedId, itemRequestedId, status }: { fromUserId: number; toUserId: number; itemOfferedId: number; itemRequestedId: number; status: string } = req.body;
  try {
    const offer = await prisma.offer.create({
      data: { fromUserId, toUserId, itemOfferedId, itemRequestedId, status },
    });
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: "Offer creation failed", details: err });
  }
});

// --- TRADES CRUD ---
app.get("/api/trades", async (req: Request, res: Response) => {
  try {
    const trades = await prisma.trade.findMany({
      include: { offer: true, ratings: true },
    });
    res.json(trades);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch trades", details: err });
  }
});

app.post("/api/trades", async (req: Request, res: Response) => {
  const { offerId, notes }: { offerId: number; notes: string } = req.body;
  try {
    const trade = await prisma.trade.create({ data: { offerId, notes } });
    res.status(201).json(trade);
  } catch (err) {
    res.status(400).json({ error: "Trade creation failed", details: err });
  }
});

app.put("/api/trades/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes }: { notes: string } = req.body;
  try {
    const updatedTrade = await prisma.trade.update({
      where: { id: Number(id) },
      data: { notes },
    });
    res.json(updatedTrade);
  } catch (err) {
    res.status(404).json({ error: "Trade not found", details: err });
  }
});

app.delete("/api/trades/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTrade = await prisma.trade.delete({
      where: { id: Number(id) },
    });
    res.json(deletedTrade);
  } catch (err) {
    res.status(404).json({ error: "Trade not found", details: err });
  }
});

// --- RATINGS CRUD ---
app.get("/api/ratings", async (req: Request, res: Response) => {
  try {
    const ratings = await prisma.rating.findMany({
      include: { user: true, trade: true },
    });
    res.json(ratings);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch ratings", details: err });
  }
});

app.post("/api/ratings", async (req: Request, res: Response) => {
  const { userId, raterId, tradeId, ratingValue, comment }: { userId: number; raterId: number; tradeId: number; ratingValue: number; comment: string } = req.body;
  try {
    const rating = await prisma.rating.create({
      data: { userId, raterId, tradeId, ratingValue, comment },
    });
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: "Rating creation failed", details: err });
  }
});

// DELETE /api/ratings/:id
app.delete("/api/ratings/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedRating = await prisma.rating.delete({
      where: { id: Number(id) },
    });
    res.json(deletedRating);
  } catch (err) {
    res.status(404).json({ error: "Rating not found", details: err });
  }
});

// ... rest of the code ...

// --- ADMIN LOGIN ---
// --- ADMIN LOGIN ---
app.post("/api/admin-login", async (req: Request, res: Response) => {
  console.log(
    "[ADMIN LOGIN] Route hit at",
    new Date().toISOString(),
    "Request body:",
    req.body
  );
  const { username, email, password } = req.body;
  // ...admin login logic...
  // Log activity
  await logActivity({
    type: "login",
    description: `Admin login attempt for ${username}`,
    username,
  });
  // ...rest of admin login logic...
  if (!username || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Username and password are required.",
      });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
  }

  // Defensive: if for some reason code falls through with invalid input, return 400
  if (
    !username ||
    !password ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid admin login input." });
  }

  try {
    // Find user by username (case-sensitive for demo; in production use hashed passwords)
    let user = null;
    if (username) {
      user = await prisma.user.findFirst({
        where: {
          password,
          username,
        },
      });
      if (user) {
        console.log("[ADMIN LOGIN] Found user by username:", user.username);
      }
    }
    if (!user && typeof email === 'string' && email.length > 0) {
      // Try finding by email
      user = await prisma.user.findFirst({
        where: {
          password,
          email,
        },
      });
      if (user) {
        console.log("[ADMIN LOGIN] Found user by email:", user.email);
      }
    }
    if (!user) {
      console.log("[ADMIN LOGIN] No user found for credentials (case-sensitive check).");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Print user object for debugging
    console.log("[ADMIN LOGIN] User found:", user);
    // Check admin flag or role (assume user.isAdmin for this example)
    const admin =
      typeof (user as { isAdmin?: boolean }).isAdmin !== "undefined" ? (user as { isAdmin?: boolean }).isAdmin : true; // fallback for demo
    if (!admin) {
      console.log("[ADMIN LOGIN] User found but not admin:", user.id);
      return res
        .status(401)
        .json({ success: false, message: "Not an admin user" });
    }
    // Success
    // Set admin_session cookie (for demo, just user id; in production use JWT)
    res.cookie("admin_session", user.id, {
      httpOnly: true,
      sameSite: "none", // Changed from 'lax' to 'none' for cross-origin support
      secure: false, // Remain false for local HTTP development
      path: "/",
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    });
    console.log("[ADMIN LOGIN] Set-Cookie: admin_session=", user.id);
    console.log("[ADMIN LOGIN] Response: { success: true, user: ... }");
    return res.json({
      success: true,
      message: "Admin login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ADMIN LOGIN ERROR]", message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: message });
  }
});

// --- FRIENDLY ROOT ROUTE ---
app.get("/", (req, res) => {
  res.send("BarterNexus API is running!");
});

// Catch-all 404 handler
app.use((req, res, next) => {
  console.error("[404 NOT FOUND]", req.method, req.originalUrl);
  res.status(404).json({ error: "Not Found" });
});

// General error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR HANDLER]", err);
  if (typeof err === "object" && err !== null && "status" in err && "message" in err) {
    res.status((err as { status?: number })?.status || 500).json({ error: (err as { message?: string })?.message || "Internal Server Error" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
