const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('AuthMiddleware: Checking token...');
  if (!token) {
    console.log('AuthMiddleware: No token provided');
    return res.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log('AuthMiddleware: Token successfully verified', decoded);
    next();
  } catch (error) {
    console.error('AuthMiddleware: Invalid token', error);
    res.status(400).send('Invalid token');
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.admin !== 1) {
    return res.status(403).send('Access denied');
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
