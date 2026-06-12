import ApiError from "../utils/ApiError.js";

export const validate = (validationFunction) => {
  return (req, res, next) => {
    const errors = validationFunction(req);

    if (errors.length > 0) {
      throw new ApiError(400, "Error de validación.", errors);
    }

    next();
  };
};

