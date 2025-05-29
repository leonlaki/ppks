const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload: ", decoded);
    req.user = decoded; // attaches { user_id: ... } to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;