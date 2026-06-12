import sequelize from "../config/database.js";

import User from "./User.js";
import Product from "./Product.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";

// 1:1 Un usuario tiene un carrito
User.hasOne(Cart, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "user",
});

// 1:N Un carrito tiene muchos items
Cart.hasMany(CartItem, {
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
  as: "items",
});

CartItem.belongsTo(Cart, {
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
  as: "cart",
});

// N:1 Un item de carrito pertenece a un producto
Product.hasMany(CartItem, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  as: "cartItems",
});

CartItem.belongsTo(Product, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  as: "product",
});

export { sequelize, User, Product, Cart, CartItem };