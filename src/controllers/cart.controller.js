import { Cart, CartItem, Product } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.utils.js";
import ApiError from "../utils/ApiError.js";

export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({
        where: { userId },
        include: [
            {
                model: CartItem,
                as: "items",
                include: [
                    {
                        model: Product,
                        as: "product"
                    }
                ]
            }
        ]
    });

    if (!cart) {
        throw new ApiError(404, "Carrito no encontrado");
    }

    successResponse(res, 200, "Carrito obtenido exitosamente", cart);
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        throw new ApiError(404, "Carrito no encontrado");
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new ApiError(404, "Producto no encontrado");
    }

    const requestedQuantity = quantity || 1;

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId }
    });

    const newTotalQuantity = existingItem ? existingItem.quantity + requestedQuantity : requestedQuantity;

    if (product.stock < newTotalQuantity) {
        throw new ApiError(400, `No hay suficiente stock. Stock disponible: ${product.stock}`);
    }

    let cartItem;
    if (existingItem) {
        existingItem.quantity = newTotalQuantity;
        await existingItem.save();
        cartItem = existingItem;
    } else {
        cartItem = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity: requestedQuantity,
            price: product.price
        });
    }

    successResponse(res, 200, "Producto agregado al carrito exitosamente", cartItem);
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        throw new ApiError(404, "Carrito no encontrado");
    }

    const cartItem = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id }
    });

    if (!cartItem) {
        throw new ApiError(404, "Item no encontrado en el carrito");
    }

    await cartItem.destroy();

    successResponse(res, 200, "Producto eliminado del carrito exitosamente");
});

export const checkoutCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "El carrito está vacío");
    }

    let total = 0;
    for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
            throw new ApiError(400, `Stock insuficiente para ${item.product.name}`);
        }
        total += Number(item.price) * item.quantity;
    }

    for (const item of cart.items) {
        item.product.stock -= item.quantity;
        await item.product.save();
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    successResponse(res, 200, "Compra realizada exitosamente", { total });
});
