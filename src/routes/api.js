const express = require('express');
const { testApi,
        handleRegister } = require('../controllers/apiController');
const router = express.Router();

// Restful API('/route', api)
router.get('/test-api', testApi);
router.post('/register', handleRegister);

module.exports = router;
