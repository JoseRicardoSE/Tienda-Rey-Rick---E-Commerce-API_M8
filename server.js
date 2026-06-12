import app from './src/app.js';
import { PORT } from './src/config/env.js';
import { testConnection } from './src/config/database.js';

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Servidor Tienda Rey Rick API está ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`No se pudo iniciar el servidor: ${error.message}`);
        process.exit(1);
    }
};

startServer();