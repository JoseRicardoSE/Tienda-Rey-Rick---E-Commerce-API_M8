import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas del carrito están protegidas
router.use(protect);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItemToCart);
router.delete("/items/:itemId", cartController.removeItemFromCart);
router.post("/checkout", cartController.checkoutCart);

export default router;
