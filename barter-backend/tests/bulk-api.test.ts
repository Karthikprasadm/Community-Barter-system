 
/// <reference types="jest" />
console.log("[DEBUG] bulk-api.test.ts loaded at", new Date().toISOString());
import './setupBroadcastMock';
import request from "supertest";
import app from "../src/app";

let testUserId: number;
let testItemId: number;

describe("Bulk Items & Offers API", () => {
  beforeAll(async () => {
    const unique = Date.now();
    const res = await request(app)
      .post("/api/users")
      .send({
        username: `bulkuser${unique}`,
        email: `bulkuser${unique}@example.com`,
        password: "BulkPassword1",
      });
    console.log("User creation response:", res.body);
    expect(res.body).toHaveProperty("id");
    testUserId = res.body.id;
    // Create a base item for offers
    const itemRes = await request(app)
      .post("/api/items")
      .send({
        name: "Base Item",
        description: "desc",
        category: "cat",
        condition: "New",
        userId: testUserId,
      });
    console.log("Base item creation response:", itemRes.body);
    expect(itemRes.body).toHaveProperty("id");
    testItemId = itemRes.body.id;
  });

  it("should bulk update items", async () => {
    const res1 = await request(app)
      .post("/api/items")
      .send({
        name: "Bulk Item 1",
        description: "desc",
        category: "cat",
        condition: "New",
        userId: testUserId,
      });
    console.log("Bulk Item 1 creation:", res1.body);
    expect(res1.body).toHaveProperty("id");
    const res2 = await request(app)
      .post("/api/items")
      .send({
        name: "Bulk Item 2",
        description: "desc",
        category: "cat",
        condition: "Used",
        userId: testUserId,
      });
    console.log("Bulk Item 2 creation:", res2.body);
    expect(res2.body).toHaveProperty("id");
    const id1 = res1.body.id;
    const id2 = res2.body.id;

    const updateRes = await request(app)
      .put("/api/items/bulk")
      .send({
        updates: [
          { id: id1, name: "Updated Bulk Item 1" },
          { id: id2, name: "Updated Bulk Item 2", condition: "Refurbished" },
        ],
      });
    console.log("Bulk update items response:", updateRes.body);
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.updatedCount).toBe(2);

    const getRes = await request(app).get("/api/items");
    const updated1 = getRes.body.find((item: { id: number }) => item.id === id1);
    const updated2 = getRes.body.find((item: { id: number }) => item.id === id2);
    expect(updated1.name).toBe("Updated Bulk Item 1");
    expect(updated2.name).toBe("Updated Bulk Item 2");
    expect(updated2.condition).toBe("Refurbished");
  });

  it("should bulk delete items", async () => {
    const res1 = await request(app)
      .post("/api/items")
      .send({
        name: "Delete Item 1",
        description: "desc",
        category: "cat",
        condition: "New",
        userId: testUserId,
      });
    console.log("Delete Item 1 creation:", res1.body);
    expect(res1.body).toHaveProperty("id");
    const res2 = await request(app)
      .post("/api/items")
      .send({
        name: "Delete Item 2",
        description: "desc",
        category: "cat",
        condition: "Used",
        userId: testUserId,
      });
    console.log("Delete Item 2 creation:", res2.body);
    expect(res2.body).toHaveProperty("id");
    const id1 = res1.body.id;
    const id2 = res2.body.id;

    const delRes = await request(app)
      .delete("/api/items/bulk")
      .send({ ids: [id1, id2] });
    console.log("Bulk delete items response:", delRes.body);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.deletedCount).toBe(2);
  });

  it("should bulk update offers", async () => {
    const res1 = await request(app)
      .post("/api/offers")
      .send({
        fromUserId: testUserId,
        toUserId: testUserId,
        itemOfferedId: testItemId,
        itemRequestedId: testItemId,
        status: "pending",
      });
    console.log("Bulk Offer 1 creation:", res1.body);
    expect(res1.body).toHaveProperty("id");
    const res2 = await request(app)
      .post("/api/offers")
      .send({
        fromUserId: testUserId,
        toUserId: testUserId,
        itemOfferedId: testItemId,
        itemRequestedId: testItemId,
        status: "pending",
      });
    console.log("Bulk Offer 2 creation:", res2.body);
    expect(res2.body).toHaveProperty("id");
    const id1 = res1.body.id;
    const id2 = res2.body.id;

    const updateRes = await request(app)
      .put("/api/offers/bulk")
      .send({
        updates: [
          { id: id1, status: "accepted" },
          { id: id2, status: "rejected" },
        ],
      });
    console.log("Bulk update offers response:", updateRes.body);
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.updatedCount).toBe(2);

    const getRes = await request(app).get("/api/offers");
    const updated1 = getRes.body.find((offer: { id: number }) => offer.id === id1);
    const updated2 = getRes.body.find((offer: { id: number }) => offer.id === id2);
    expect(updated1.status).toBe("accepted");
    expect(updated2.status).toBe("rejected");
  });

  it("should bulk delete offers", async () => {
    const res1 = await request(app)
      .post("/api/offers")
      .send({
        fromUserId: testUserId,
        toUserId: testUserId,
        itemOfferedId: testItemId,
        itemRequestedId: testItemId,
        status: "pending",
      });
    console.log("Delete Offer 1 creation:", res1.body);
    expect(res1.body).toHaveProperty("id");
    const res2 = await request(app)
      .post("/api/offers")
      .send({
        fromUserId: testUserId,
        toUserId: testUserId,
        itemOfferedId: testItemId,
        itemRequestedId: testItemId,
        status: "pending",
      });
    console.log("Delete Offer 2 creation:", res2.body);
    expect(res2.body).toHaveProperty("id");
    const id1 = res1.body.id;
    const id2 = res2.body.id;

    const delRes = await request(app)
      .delete("/api/offers/bulk")
      .send({ ids: [id1, id2] });
    console.log("Bulk delete offers response:", delRes.body);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.deletedCount).toBe(2);
  });
});
