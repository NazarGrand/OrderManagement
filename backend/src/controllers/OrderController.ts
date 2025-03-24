import { Request, Response } from "express";
import OrderService from "../services/OrderService";
import ApiError from "../common/errors/ApiError";
import { CreateOrderDto } from "../common/dtos/CreateOrderDto";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import logger from "../common/utils/logger";

class OrderController {
  async createOrder(req: Request, res: Response) {
    const { userId, productId, quantity } = plainToClass(
      CreateOrderDto,
      req.body,
      {
        excludeExtraneousValues: true,
      }
    );

    const errors = validateSync({ userId, productId, quantity });

    if (errors.length > 0) {
      logger.warn("Validation failed", { errors, body: req.body });
      res.status(400).json(errors);
      return;
    }

    try {
      const result = await OrderService.createOrder(
        userId,
        productId,
        quantity
      );
      logger.info("Order created", { userId, productId, quantity, result });

      res.json(result);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        logger.error("API error", {
          message: error.message,
          statusCode: error.statusCode,
        });

        res.status(error.statusCode).json({ message: error.message });
      } else {
        logger.error("Server error", { error });
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getUserOrders(req: Request, res: Response) {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    logger.info("Fetching user orders", { userId, page, limit });

    try {
      const { orders, total } = await OrderService.getUserOrders(
        userId,
        page,
        limit
      );

      logger.info("User orders retrieved successfully", {
        userId,
        orderCount: total,
      });

      res.json({
        total,
        totalPages: Math.ceil(total / limit),
        orders,
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        logger.error("API error while fetching user orders", {
          userId,
          message: error.message,
          statusCode: error.statusCode,
        });

        res.status(error.statusCode).json({ message: error.message });
      } else {
        logger.error("Unexpected error while fetching user orders", {
          userId,
          error,
        });
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

export default new OrderController();
