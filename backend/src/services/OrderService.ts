import { Repository } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User.entity";
import { Product } from "../entities/Product.entity";
import ApiError from "../common/errors/ApiError";
import { Order } from "../entities/Order.entity";

class OrderService {
  private userRepository: Repository<User>;
  private productRepository: Repository<Product>;
  private orderRepository: Repository<Order>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.productRepository = AppDataSource.getRepository(Product);
    this.orderRepository = AppDataSource.getRepository(Order);
  }

  async createOrder(userId: string, productId: string, quantity: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ApiError(`User with id: ${userId} not found`, 404);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new ApiError(`Product with id: ${productId} not found`, 404);
    }

    if (product.stock < quantity) {
      throw new ApiError(
        `Not enough stock available for product ${product.name}`,
        400
      );
    }

    if (user.balance < product.price * quantity) {
      throw new ApiError(`User ${user.name} has insufficient balance`, 400);
    }

    const transactionEntityManager = AppDataSource.manager;
    await transactionEntityManager.transaction(async (transactionManager) => {
      user.balance -= product.price * quantity;
      await transactionManager.save(user);

      product.stock -= quantity;
      await transactionManager.save(product);

      const order = transactionManager.create(Order, {
        user,
        product,
        quantity,
        totalPrice: product.price * quantity,
      });

      await transactionManager.save(order);
    });

    return { message: "Order created successfully" };
  }

  async getUserOrders(userId: string, page: number, limit: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ["user", "product"],
      order: { createdAt: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { orders, total };
  }
}

export default new OrderService();
