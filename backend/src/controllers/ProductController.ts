import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { Product } from "../entities/Product.entity";
import logger from "../common/utils/logger";

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find();

      logger.info("Fetching products", products);
      res.json(products);
    } catch (error: unknown) {
      logger.error("Server error", { error });
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new ProductController();
