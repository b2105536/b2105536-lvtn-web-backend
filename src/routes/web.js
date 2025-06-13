const express = require('express');
const { getHomepage, getABC, getCRUD, postCRUD } = require('../controllers/homeController');
const router = express.Router();

// router.Method('/route', handler)
router.get('/', getHomepage);
router.get('/abc', getABC);
router.get('/crud', getCRUD);

router.post('/post-crud', postCRUD);

module.exports = router;
