import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.utils.js";

export const protect = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new ApiError(401, "Token no proporcionado.");
  }

  try {
    const decoded = verifyToken(token);

    //  Guardamos los datos del usuario autenticado en req.user.
    // Así los controllers y services pueden saber quién hace la petición.

    req.user = decoded;

    next();
  } catch (error) {
    throw new ApiError(401, "Token inválido o expirado.");
  }
};

// En Express, req trae la información de la petición, res sirve para responder, y next permite continuar al siguiente paso.
// Los middlewares usan esos tres porque están entre la ruta y el controller. Validan, protegen o manejan errores antes de que la petición siga avanzando.
