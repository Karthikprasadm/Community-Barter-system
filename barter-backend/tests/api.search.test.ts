import './setupBroadcastMock';
import request from "supertest";
import app from "../src/app";

describe("Advanced Search & Filter API", () => {
  let userId: number;
  let itemId: number;

  beforeAll(async () => {
    // Create a user
    const res = await request(app)
      .post("/api/users")
      .send({ username: "searchtester", email: "searchtester@example.com", password: "TestPass123" });
    userId = res.body.id;
    // Create items
    await request(app).post("/api/items").send({
      name: "Harry Potter Book",
      description: "A fantasy novel",
      category: "Books",
      condition: "Good",
      userId,
    });
    await request(app).post("/api/items").send({
      name: "Chess Set",
      description: "Board game",
      category: "Toys",
      condition: "New",
      userId,
    });
  });

  it("should search items by name", async () => {
    const res = await request(app).get("/api/items/search?name=Harry");
    expect(res.statusCode).toBe(200);
    expect(res.body.some((item: any) => item.name.includes("Harry"))).toBe(true);
  });

  it("should filter items by category", async () => {
    const res = await request(app).get("/api/items/search?category=Toys");
    expect(res.statusCode).toBe(200);
    expect(res.body.every((item: any) => item.category === "Toys")).toBe(true);
  });

  it("should perform generic text search (q)", async () => {
    const res = await request(app).get("/api/items/search?q=chess");
    expect(res.statusCode).toBe(200);
    expect(res.body.some((item: any) => item.name.toLowerCase().includes("chess"))).toBe(true);
  });

  it("should search users by username", async () => {
    const res = await request(app).get("/api/users/search?username=searchtester");
    expect(res.statusCode).toBe(200);
    expect(res.body.some((user: any) => user.username === "searchtester")).toBe(true);
  });

  it("should perform generic user search (q)", async () => {
    const res = await request(app).get("/api/users/search?q=searchtester");
    expect(res.statusCode).toBe(200);
    expect(res.body.some((user: any) => user.username === "searchtester")).toBe(true);
  });
});
