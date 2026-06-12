# Tienda Rey Rick - E-Commerce API (Módulo 8)

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Handlebars](https://img.shields.io/badge/Handlebars-f0772b?style=for-the-badge&logo=Handlebars.js&logoColor=white)

Backend RESTful y Frontend híbrido para **Tienda Rey Rick**, construido con Node.js, Express, PostgreSQL y Handlebars. Cumple con todos los requerimientos del Módulo 8.

## 🌟 Características Principales

- **Arquitectura Híbrida (SSR + REST)**: Vistas renderizadas desde el servidor usando `express-handlebars` para mejor estructura, que interactúan con una API REST en JSON a través de `fetch`.
- **Autenticación Segura (HttpOnly Cookies)**: Protección de endpoints mediante JWT (JSON Web Tokens). Los tokens se almacenan en Cookies HttpOnly y SameSite=Strict para neutralizar vulnerabilidades XSS.
- **Carritos Independientes**: La compra de productos y los carritos están aislados por usuario y guardados en PostgreSQL (1 Usuario = 1 Carrito).
- **Validación de Stock**: Lógica de verificación en tiempo real de stock al momento de añadir productos y realizar checkout.
- **Transacciones Seguras**: El registro de usuarios garantiza la creación simultánea del usuario y su carrito mediante `sequelize.transaction()`.

## 🛠 Instalación y Configuración

1. **Clonar el repositorio** e instalar dependencias:
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**:
   Copia el archivo `.env.example` a `.env` y configura tus credenciales de PostgreSQL.
   ```bash
   cp .env.example .env
   ```

3. **Inicializar Base de Datos y Población (Seeding)**:
   Ejecuta los siguientes scripts para sincronizar los modelos y llenar la base de datos con los productos iniciales y un usuario de prueba.
   ```bash
   npm run db:sync
   npm run db:seed
   ```

4. **Levantar el Servidor**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Endpoints Principales (API REST)

| Método | Endpoint | Descripción | Seguridad |
|---|---|---|---|
| GET | `/api/v1/products` | Lista el catálogo de productos y el stock real. | Público |
| POST | `/api/v1/products` | Crea un nuevo producto en la tienda. | Cookie JWT |
| POST | `/api/v1/auth/login` | Iniciar sesión. Retorna Cookie HttpOnly. | Público |
| POST | `/api/v1/auth/register` | Registrar un usuario y crear su carrito en la BD. | Público |
| GET | `/api/v1/cart` | Obtiene el carrito del usuario. | Cookie JWT |
| POST | `/api/v1/cart/items` | Añade un producto al carrito verificando stock. | Cookie JWT |
| POST | `/api/v1/cart/checkout` | Finaliza compra, resta stock real y vacía carrito. | Cookie JWT |

## 🎬 Demostración Automatizada

A continuación, una prueba automatizada del flujo completo (Registro, Login, Añadir al Carrito y Checkout exitoso):

![Demo Tienda Rey Rick](./src/public/assets/images/demo.webp)
