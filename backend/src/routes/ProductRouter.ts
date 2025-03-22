import { Router } from "express";
import ProductController from "../controllers/ProductController";

const router = Router();

router.get("/", ProductController.getAllProducts);

export default router;
