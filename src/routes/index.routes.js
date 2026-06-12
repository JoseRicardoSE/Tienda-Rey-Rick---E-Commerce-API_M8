import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";

const router = Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de productos
router.use("/products", productRoutes);

// Rutas del carrito
router.use("/cart", cartRoutes);

export default router;