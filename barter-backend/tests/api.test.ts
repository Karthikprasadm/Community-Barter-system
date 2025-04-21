console.log("[DEBUG] api.test.ts loaded at", new Date().toISOString());
import './setupBroadcastMock';
import request from "supertest";
import app from "../src/app";

let testUserId: number;

describe("Community Barter System API", () => {
  beforeAll(async () => {
    // Use a unique username/email to avoid unique constraint errors
    const unique = Date.now();
    const res = await request(app)
      .post("/api/users")
      .send({
        username: `apitestuser${unique}`,
        email: `apitestuser${unique}@example.com`,
        password: "TestPassword1",
      });
    testUserId = res.body.id;
  });

  afterAll(async () => {
    // Optionally: Clean up test user/items if your API supports delete endpoints
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("should create a new user", async () => {
    const unique = Date.now();
    const res = await request(app)
      .post("/api/users")
      .send({
        username: `testuser${unique}`,
        email: `testuser${unique}@example.com`,
        password: "TestPassword2",
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
  });

  it("should get all items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Test Item",
        description: "A test item",
        category: "Misc",
        condition: "New",
        userId: testUserId,
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
  });

  let testItemId: number;
  let testOfferId: number;
  let testTradeId: number;
  let testRatingId: number;

  it("should create a new item for offers/trades", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Offer Item",
        description: "For offer",
        category: "Misc",
        condition: "Used",
        userId: testUserId,
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
    testItemId = res.body.id;
  });

  it("should create a new offer", async () => {
    const res = await request(app).post("/api/offers").send({
      fromUserId: testUserId,
      toUserId: testUserId, // self-offer for test
      itemOfferedId: testItemId,
      itemRequestedId: testItemId,
      status: "pending",
    });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
    testOfferId = res.body.id;
  });

  it("should get all offers", async () => {
    const res = await request(app).get("/api/offers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new trade (accept offer)", async () => {
    const res = await request(app)
      .post("/api/trades")
      .send({ offerId: testOfferId, notes: "Test trade notes" });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
    testTradeId = res.body.id;
  });

  it("should get all trades", async () => {
    const res = await request(app).get("/api/trades");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a trade", async () => {
    const res = await request(app)
      .put(`/api/trades/${testTradeId}`)
      .send({ notes: "Updated trade notes" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("notes", "Updated trade notes");
  });

  it("should create a new rating for a trade", async () => {
    const res = await request(app)
      .post("/api/ratings")
      .send({
        userId: testUserId,
        raterId: testUserId,
        tradeId: testTradeId,
        ratingValue: 5,
        comment: "Great trade!",
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("id");
    testRatingId = res.body.id;
  });

  it("should get all ratings", async () => {
    const res = await request(app).get("/api/ratings");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete a trade", async () => {
    // Delete the rating for this trade first to avoid FK constraint
    await request(app).delete(`/api/ratings/${testRatingId}`);
    const res = await request(app).delete(`/api/trades/${testTradeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testTradeId);
  });
});
