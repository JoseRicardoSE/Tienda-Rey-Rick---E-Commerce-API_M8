//Clase para crear errores controlados.

// Esto evita responder errores desordenados o mensajes internos del servidor como mensajes directos al cliente

class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ApiError;
