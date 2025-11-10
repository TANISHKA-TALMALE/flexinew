const jwt = require('jsonwebtoken');
const { findById } = require('../models/User');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = { protect };