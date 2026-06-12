import { Sequelize} from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from "./env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false, // Desactiva los logs de Sequelize
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos(PostgreSQL) exitosa.");
    } catch (error) {
        console.error(`Error: No se pudo conectar a la base de datos(PostgreSQL): ${error.message}`);
    }
};

export default sequelize;