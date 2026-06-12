import { sequelize } from "../src/models/index.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });

    console.log("Modelos sincronizados correctamente.");
  } catch (error) {
    console.error("Error al sincronizar modelos:", error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
