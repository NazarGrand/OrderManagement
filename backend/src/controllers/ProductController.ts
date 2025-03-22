import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { Product } from "../entities/Product.entity";

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find();

      if (!products.length) {
        res.status(404).json("No products found");
        return;
      }

      res.json(products);
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new ProductController();
