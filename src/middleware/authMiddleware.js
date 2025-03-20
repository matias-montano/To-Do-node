import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const SECRET_KEY = process.env.SECRET_KEY; // Cargar la clave secreta desde las variables de entorno

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado Authorization
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verificar el token
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware para verificar roles
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes el rol adecuado.' });
    }
    next();
  };
};