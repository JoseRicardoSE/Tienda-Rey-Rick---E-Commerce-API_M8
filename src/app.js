import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import webRoutes from "./routes/web.routes.js";
import apiRoutes from "./routes/index.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use("/uploads", express.static(path.join(publicPath, 'uploads')));

// Routes
app.use('/', webRoutes);
app.use('/api/v1', apiRoutes);

// Catch 404
app.use((req, res, next) => {
    next(new ApiError(404, "Ruta no encontrada"));
});

// Error handling
app.use(errorMiddleware);

export default app;