// middlewares/admin-middleware.js
const authMiddleware = require('./auth-middleware');

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.isAdmin) {
      next(); // User is admin, proceed to the next middleware or route
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  });
};

module.exports = adminMiddleware;
