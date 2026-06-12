import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

import {
    validateRegister,
    validateLogin,
} from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(validateRegister), authController.register);
router.post("/login", validate(validateLogin), authController.login);

router.get("/me", protect, authController.me);
router.post("/logout", authController.logout);

export default router;