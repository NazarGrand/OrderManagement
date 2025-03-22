import { Router } from "express";
import userRoutes from "./UserRouter";
import productRoutes from "./ProductRouter";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
