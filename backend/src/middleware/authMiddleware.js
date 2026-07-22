const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

//Middleware to authenticate requests using JWT.
 
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header exists and has "Bearer " prefix
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token with jwt.verify()
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Attach decoded payload to req.user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
