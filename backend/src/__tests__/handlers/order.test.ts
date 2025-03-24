import request from "supertest";
import { AppDataSource } from "../../db/data-source";
import app from "../../server";
import { User } from "../../entities/User.entity";
import { Product } from "../../entities/Product.entity";
import { Order } from "../../entities/Order.entity";

describe("Order Management API", () => {
  let user: User;
  let product: Product;
  let lowBalanceUser: User;
  let rollbackUser: User;
  let productForRollback: Product;

  beforeAll(async () => {
    await AppDataSource.initialize();
    user = await createTestUser("test@example.com", 100);
    product = await createTestProduct("Test Product", 20, 5);
    lowBalanceUser = await createTestUser("lowbalance@example.com", 10);
    rollbackUser = await createTestUser("rollback@example.com", 5);
    productForRollback = await createTestProduct("Rollback Product", 20, 5);
  });

  afterAll(async () => {
    await deleteOrdersForUser(user.id);
    await deleteOrdersForUser(lowBalanceUser.id);
    await deleteOrdersForUser(rollbackUser.id);
    await deleteOrdersForUser(productForRollback.id);
    await deleteProduct(product.id);
    await deleteProduct(productForRollback.id);
    await deleteUser(user.id);
    await deleteUser(lowBalanceUser.id);
    await deleteUser(rollbackUser.id);
    await AppDataSource.destroy();
  });

  it("should create an order successfully", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ userId: user.id, productId: product.id, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
  });

  it("should not create an order if user balance is insufficient", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ userId: lowBalanceUser.id, productId: product.id, quantity: 2 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `User ${lowBalanceUser.name} has insufficient balance`
    );
  });

  it("should not create an order if product is out of stock", async () => {
    product.stock = 0;
    await AppDataSource.getRepository(Product).save(product);

    const response = await request(app)
      .post("/orders")
      .send({ userId: user.id, productId: product.id, quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Not enough stock available for product ${product.name}`
    );
  });

  it("should return all orders for a user", async () => {
    const response = await request(app).get(`/orders/${user.id}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.orders)).toBe(true);
  });

  it("should rollback transaction if balance deduction fails", async () => {
    const response = await request(app).post("/orders").send({
      userId: rollbackUser.id,
      productId: productForRollback.id,
      quantity: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `User ${rollbackUser.name} has insufficient balance`
    );
  });

  it("should enforce rate limiting", async () => {
    let requestCount = 0;
    while (requestCount < 10) {
      await request(app).get(`/orders/${user.id}`);
      requestCount++;
    }

    const response = await request(app).get(`/orders/${user.id}`);
    expect(response.status).toBe(429);
  });
});

async function createTestUser(email: string, balance: number): Promise<User> {
  return await AppDataSource.getRepository(User).save({
    name: "Test User",
    email: email,
    balance: balance,
  });
}

async function createTestProduct(
  name: string,
  price: number,
  stock: number
): Promise<Product> {
  return await AppDataSource.getRepository(Product).save({
    name: name,
    price: price,
    stock: stock,
  });
}

async function deleteOrdersForUser(userId: string): Promise<void> {
  await AppDataSource.getRepository(Order).delete({ user: { id: userId } });
}

async function deleteUser(userId: string): Promise<void> {
  await AppDataSource.getRepository(User).delete(userId);
}

async function deleteProduct(productId: string): Promise<void> {
  await AppDataSource.getRepository(Product).delete(productId);
}
