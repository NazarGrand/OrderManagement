import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User.entity";
import logger from "../common/utils/logger";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      logger.info("Fetching users", users);
      res.json(users);
    } catch (error: unknown) {
      logger.error("Server error", { error });
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
