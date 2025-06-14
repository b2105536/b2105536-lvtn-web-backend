const express = require('express');
const { getHomepage, getABC, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD } = require('../controllers/homeController');
const router = express.Router();

// router.Method('/route', handler)
router.get('/', getHomepage);
router.get('/abc', getABC);
router.get('/crud', getCRUD);

router.post('/post-crud', postCRUD);
router.get('/get-crud', displayGetCRUD);
router.get('/edit-crud', getEditCRUD);
router.post('/put-crud', putCRUD);

module.exports = router;
