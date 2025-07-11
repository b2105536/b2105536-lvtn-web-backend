const express = require('express');
const { handleRegister, handleLogin } = require('../controllers/apiController');
const { readFunc,
        createFunc,
        updateFunc,
        deleteFunc } = require('../controllers/userController');
const { readFunc: groupReadFunc } = require('../controllers/groupController');
const { checkUserJWT, checkUserPermission } = require('../middleware/JWTAction');
const router = express.Router();

// Restful API('/route', api)
router.post('/register', handleRegister);
router.post('/login', handleLogin);

router.get('/user/read', checkUserJWT, checkUserPermission, readFunc);
router.post('/user/create', createFunc);
router.put('/user/update', updateFunc);
router.delete('/user/delete', deleteFunc);

router.get('/group/read', groupReadFunc);

module.exports = router;
