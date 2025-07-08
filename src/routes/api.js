const express = require('express');
const { testApi,
        handleRegister,
        handleLogin } = require('../controllers/apiController');
const { readFunc,
        createFunc,
        updateFunc,
        deleteFunc } = require('../controllers/userController');
const router = express.Router();

// Restful API('/route', api)
router.get('/test-api', testApi);
router.post('/register', handleRegister);
router.post('/login', handleLogin);

router.get('/user/read', readFunc);
router.post('/user/create', createFunc);
router.put('/user/update', updateFunc);
router.delete('/user/delete', deleteFunc);

module.exports = router;
