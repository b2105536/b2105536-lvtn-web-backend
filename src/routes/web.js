const express = require('express');
const { getHomepage, getABC } = require('../controllers/homeController');
const router = express.Router();

// router.Method('/route', handler)
router.get('/', getHomepage);
router.get('/abc', getABC);

module.exports = router;
