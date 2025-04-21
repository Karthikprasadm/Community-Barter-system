 
/// <reference types="jest" />
import './setupBroadcastMock';
import request from "supertest";
import app from "../src/app";

describe("API Edge Cases & Permissions", () => {
  let userId: number;
  let itemId: number;
  let offerId: number;
  let tradeId: number;
  let ratingId: number;

  beforeAll(async () => {
    const unique = Date.now();
    // Create a user
    const res = await request(app)
      .post("/api/users")
      .send({
        username: `edgeuser${unique}`,
        email: `edgeuser${unique}@example.com`,
        password: "EdgePassword1",
      });
    userId = res.body.id;
    // Create an item
    const itemRes = await request(app)
      .post("/api/items")
      .send({
        name: "Edge Item",
        description: "desc",
        category: "cat",
        condition: "New",
        userId,
      });
    itemId = itemRes.body.id;
  });

  it("should reject creating a user with missing fields", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ username: "incomplete" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject creating an item with invalid userId", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Invalid Item",
        description: "desc",
        category: "cat",
        condition: "New",
        userId: 999999,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject creating an offer with missing fields", async () => {
    const res = await request(app)
      .post("/api/offers")
      .send({ fromUserId: userId });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject creating a rating with invalid tradeId", async () => {
    const res = await request(app)
      .post("/api/ratings")
      .send({
        userId,
        raterId: userId,
        tradeId: 999999,
        ratingValue: 5,
        comment: "Invalid trade",
      });
    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for deleting nonexistent user", async () => {
    const res = await request(app).delete("/api/users/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for deleting nonexistent item", async () => {
    // Use a valid userId (simulate authenticated user), but item does not exist
    const res = await request(app)
      .delete("/api/items/999999")
      .send({ userId: 1 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for deleting nonexistent trade", async () => {
    const res = await request(app).delete("/api/trades/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for deleting nonexistent rating", async () => {
    const res = await request(app).delete("/api/ratings/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject login with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "notarealuser", password: "wrongpass" });
    expect([400, 401]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject admin login with short password", async () => {
    const res = await request(app)
      .post("/api/admin-login")
      .send({ username: "admin", password: "short" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should reject admin login with missing fields", async () => {
    const res = await request(app)
      .post("/api/admin-login")
      .send({ password: "somethinglong" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // --- Additional Authorization & Ownership Tests ---

  it("should not allow a user to delete another user's item", async () => {
    // Create user1
    const unique1 = Date.now();
    const res1 = await request(app)
      .post("/api/users")
      .send({
        username: `owneruser${unique1}`,
        email: `owneruser${unique1}@example.com`,
        password: "OwnerPassword1",
      });
    const user1Id = res1.body.id;
    // Create user2
    const unique2 = Date.now() + 1;
    const res2 = await request(app)
      .post("/api/users")
      .send({
        username: `otheruser${unique2}`,
        email: `otheruser${unique2}@example.com`,
        password: "OtherPassword1",
      });
    const user2Id = res2.body.id;
    // User1 creates an item
    const itemRes = await request(app)
      .post("/api/items")
      .send({
        name: "Ownership Test Item",
        description: "desc",
        category: "cat",
        condition: "New",
        userId: user1Id,
      });
    const itemId = itemRes.body.id;
    // User2 tries to delete user1's item
    const delRes = await request(app)
      .delete(`/api/items/${itemId}`)
      .send({ userId: user2Id });
    expect([401, 403]).toContain(delRes.statusCode);
    expect(delRes.body).toHaveProperty("error");
  });

  // --- WebSocket Event Test (Pseudocode, for illustrative purposes) ---
  // This is a placeholder. Actual implementation requires a running WebSocket server and client.
  // it("should emit item:created event via WebSocket", (done) => {
  //   const io = require("socket.io-client");
  //   const socket = io("http://localhost:PORT");
  //   socket.on("item:created", (data) => {
  //     expect(data.name).toBe("WebSocket Test Item");
  //     socket.disconnect();
  //     done();
  //   });
  //   request(app).post("/api/items").send({ name: "WebSocket Test Item", ... });
  // });

});
