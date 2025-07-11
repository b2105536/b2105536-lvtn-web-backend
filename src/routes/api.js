const express = require('express');
const { testApi,
        handleRegister,
        handleLogin } = require('../controllers/apiController');
const { readFunc,
        createFunc,
        updateFunc,
        deleteFunc } = require('../controllers/userController');
const { readFunc: groupReadFunc } = require('../controllers/groupController');
const router = express.Router();

const testMiddleware = (req, res, next) => {
    console.log("Calling a middleware!");
    next();
}

// Restful API('/route', api)
router.get('/test-api', testApi);
router.post('/register', handleRegister);
router.post('/login', handleLogin);

router.get('/user/read', readFunc);
router.post('/user/create', createFunc);
router.put('/user/update', updateFunc);
router.delete('/user/delete', deleteFunc);

router.get('/group/read', groupReadFunc);

module.exports = router;
