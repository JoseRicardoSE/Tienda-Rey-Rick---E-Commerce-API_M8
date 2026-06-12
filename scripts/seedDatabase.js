import { sequelize, User, Product } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.utils.js";

const seedDatabase = async () => {
  try {
    const productsCount = await Product.count();

    if (productsCount > 0) {
      console.log("La base de datos ya tiene productos. Seed omitido.");
      return;
    }

    await Product.bulkCreate([
      {
        name: "Laptop Gamer",
        description: "Laptop de alto rendimiento para juegos.",
        price: 1500000.00,
        stock: 10,
      },
      {
        name: "Teclado Mecánico",
        description: "Teclado mecánico con luces RGB.",
        price: 80000.00,
        stock: 50,
      },
      {
        name: "Mouse Inalámbrico",
        description: "Mouse ergonómico inalámbrico.",
        price: 45000.00,
        stock: 30,
      }
    ]);

    console.log("Productos iniciales insertados correctamente.");

    // Opcional: Crear un usuario de prueba
    const usersCount = await User.count();
    if (usersCount === 0) {
      const password = await hashPassword("123456");
      const user = await User.create({
        fullName: "Juan Riquelme",
        rut: "28344898-2",
        address: "Av. Maipu 1180",
        phone: "+56944977275",
        email: "juan123@gmail.com",
        password,
      });

      // Importante: Crear el carrito asociado
      const { Cart } = await import("../src/models/index.js");
      await Cart.create({ userId: user.id });

      console.log("Usuario de prueba creado: juan123@gmail.com / 123456");
    }

  } catch (error) {
    console.error("Error al insertar datos iniciales:", error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
