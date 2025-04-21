import './setupBroadcastMock';
import request from "supertest";
import app from "../src/app";

describe("API Rare Edge Cases", () => {
  it("should return 400 for malformed JSON payload", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send('{username: "badjson"}') // intentionally malformed
    expect([400, 415]).toContain(res.statusCode);
  });

  it("should return 405 for unsupported HTTP method", async () => {
    const res = await request(app)
      .patch("/api/items") // PATCH not implemented
      .send({});
    expect([404, 405]).toContain(res.statusCode);
  });

  it("should return 413 for very large payload", async () => {
    const bigString = "x".repeat(1024 * 1024 * 2); // 2MB
    const res = await request(app)
      .post("/api/items")
      .send({ name: bigString, description: bigString, category: "cat", condition: "New", userId: 1 });
    expect([413, 400, 422]).toContain(res.statusCode);
  });

  // Add more as your API grows (e.g., permission/role-based, rate limiting, etc.)
});
