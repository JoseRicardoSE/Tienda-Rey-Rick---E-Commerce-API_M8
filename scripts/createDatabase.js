import pg from 'pg';
import {
    DB_NAME, 
    DB_USER, 
    DB_PASSWORD, 
    DB_HOST, 
    DB_PORT
} from '../src/config/env.js';

const { Client } = pg;

const createDatabase = async () => {
    const client = new Client({
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        database: 'postgres',
    });
    try {
        await client.connect();
        const result = await client.query(`SELECT 1 FROM pg_database WHERE datname= $1`, [DB_NAME]
        );
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE "${DB_NAME}"`);
            console.log(`Base de datos ${DB_NAME} creada exitosamente.`);
        } else {
            console.log(`La base de datos ${DB_NAME} ya existe.`);
        }
    } catch (error) {
        console.error(`Error al crear/verificar la base de datos: ${error.message}`);
        throw error;
    }finally {
        await client.end();
    }
};

createDatabase();


        


