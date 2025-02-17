const JWT = require("jsonwebtoken");


const SECRET_KEY = process.env.JWT_SECRET || "kh56dfgj";

const createToken = async (user) => {
  const token = await JWT.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};


module.exports = {
  createToken,
  verifyToken,
};