import path from "path";
import fs from "fs";

//Extensiones permitidas para imágenes de perfil.
export const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

//Obtiene la extensión de un archivo en minúsculas.
export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

//Valida si la extensión del archivo es la permitida.
export const isAllowedImageExtension = (filename) => {
  const extension = getFileExtension(filename);
  return allowedImageExtensions.includes(extension);
};

//Genera un nombre único para evitar sobrescribir archivos.
export const generateUniqueFileName = (originalName) => {
  const extension = getFileExtension(originalName);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${uniqueSuffix}${extension}`;
};

// Elimina un archivo si existe.
// Lo usamos cuando el usuario reemplace una imagen anterior.
export const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
