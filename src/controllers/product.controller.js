import { Product } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.utils.js";
import ApiError from "../utils/ApiError.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.findAll();
    successResponse(res, 200, "Productos obtenidos exitosamente", products);
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        throw new ApiError(404, "Producto no encontrado");
    }

    successResponse(res, 200, "Producto obtenido exitosamente", product);
});

// Admin endpoint for seeding/testing
export const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    successResponse(res, 201, "Producto creado exitosamente", product);
});
