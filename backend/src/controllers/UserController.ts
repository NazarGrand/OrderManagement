import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User.entity";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      if (!users.length) {
        res.status(404).json("No users found");
        return;
      }

      res.json(users);
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
