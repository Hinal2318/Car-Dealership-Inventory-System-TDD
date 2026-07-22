// Middleware to check if the authenticated user has an 'admin' role.

const adminMiddleware = (req, res, next) => {
    
  //  Ensure user is authenticated and is an admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = adminMiddleware;
