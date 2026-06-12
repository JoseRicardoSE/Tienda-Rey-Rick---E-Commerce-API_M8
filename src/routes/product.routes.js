import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected route to create products (useful for seeding)
router.post("/", protect, productController.createProduct);

export default router;
