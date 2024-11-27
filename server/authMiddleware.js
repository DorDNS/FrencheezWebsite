const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
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
