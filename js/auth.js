const jwt = require('jsonwebtoken');

const secretKey = 'mi_secreto_super_seguro'; // Cambia por una clave segura

// Generar un token
const generateToken = (user) => {
  return jwt.sign(user, secretKey, { expiresIn: '1h' }); // Token válido por 1 hora
};

// Middleware para verificar el token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No estás autenticado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user; // Adjunta los datos del usuario al request
    next();
  });
};

module.exports = { generateToken, authenticateJWT };
