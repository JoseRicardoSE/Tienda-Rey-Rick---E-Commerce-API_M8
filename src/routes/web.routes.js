import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Inicio" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

router.get("/cart", (req, res) => {
  res.render("cart", { title: "Mi Carrito" });
});

export default router;
