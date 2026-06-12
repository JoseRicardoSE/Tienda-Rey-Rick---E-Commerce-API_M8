import ApiError from "../utils/ApiError.js";
import { hashPassword, comparePassword} from "../utils/password.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
import { User, Cart, sequelize } from "../models/index.js";

export const register = async (userData) => {
    const normalizedEmail = userData.email.toLowerCase();
    const existingUser = await User.findOne({
        where: {
            email: normalizedEmail,
        }
    });

    if (existingUser) {
        throw new ApiError(409, "El email ya se encuentra registrado");
    }

    const transaction = await sequelize.transaction();

    try {
        const hashedPassword = await hashPassword(userData.password);

        const user = await User.create(
            {
                ...userData,
                email: normalizedEmail,
                password: hashedPassword,
            },
            { transaction }
        );

        // Crear carrito independiente para el usuario
        await Cart.create(
            {
                userId: user.id,
            },
            { transaction }
        );

        await transaction.commit();

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const login = async ({ email, password}) => {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({
        where: {
            email: normalizedEmail,
        },
    });

    if (!user) {
        throw new ApiError(401, "Credenciales invalidas"); 
    }

    const passwordIsValid = await comparePassword(password, user.password);

    if(!passwordIsValid) {
        throw new ApiError(401, "Credenciales invalidas");
    }

    const token = generateToken({ 
        id: user.id, 
        email: user.email 
    });

    return { 
        token, 
        user: { 
            id: user.id, 
            fullName: user.fullName, 
            email: user.email,
        },
    };
};