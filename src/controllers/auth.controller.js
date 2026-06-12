import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.utils.js";

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    successResponse(res, 201, "Usuario registrado exitosamente", user);
});

export const login = asyncHandler( async (req, res) => {
    const data = await authService.login(req.body);
    
    res.cookie('jwt', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    successResponse(res, 200, "Inicio de sesión exitoso", { user: data.user });
});

export const me = asyncHandler(async (req, res) => {
    // El middleware protect ya puso req.user (payload del token)
    successResponse(res, 200, "Usuario actual", req.user);
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('jwt');
    successResponse(res, 200, "Sesión cerrada exitosamente");
});
