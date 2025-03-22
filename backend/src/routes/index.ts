import { Router } from "express";
import userRoutes from "./UserRouter";
import productRoutes from "./ProductRouter";
import orderRoutes from "./OrderRouter";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
