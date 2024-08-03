// routes/admin-routes.js
const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/admin-middleware');

// Example admin route
router.get('/admin-dashboard', adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
