const express = require('express');
const { testApi,
        handleRegister,
        handleLogin } = require('../controllers/apiController');
const router = express.Router();

// Restful API('/route', api)
router.get('/test-api', testApi);
router.post('/register', handleRegister);
router.post('/login', handleLogin);

module.exports = router;
