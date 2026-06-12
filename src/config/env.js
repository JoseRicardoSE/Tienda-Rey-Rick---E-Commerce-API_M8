import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariable = [
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
    "DB_PORT",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
]

requiredEnvVariable.forEach((variableName) => {
    if (!process.env[variableName]) {
        throw new Error(`Falta la variable de entorno ${variableName}`);
    }
});

export const PORT = process.env.PORT || 3000;

export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT);

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const INITIAL_BALANCE = Number(process.env.INITIAL_BALANCE || 100000);