const express = require('express');
const { handleRegister, handleLogin, handleLogout } = require('../controllers/apiController');
const { readFunc, createFunc, updateFunc, deleteFunc, getUserAccount } = require('../controllers/userController');
const { readFunc: roleReadFunc,
        createFunc: roleCreateFunc,
        updateFunc: roleUpdateFunc,
        deleteFunc: roleDeleteFunc,
        getRoleByGroup } = require('../controllers/roleController');
const { readFunc: groupReadFunc } = require('../controllers/groupController');
const { checkUserJWT, checkUserPermission } = require('../middleware/JWTAction');
const router = express.Router();

// Restful API('/route', api)
router.all('*', checkUserJWT, checkUserPermission);
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/account', getUserAccount);

// User routes
router.get('/user/read', readFunc);
router.post('/user/create', createFunc);
router.put('/user/update', updateFunc);
router.delete('/user/delete', deleteFunc);

// Role routes
router.get('/role/read', roleReadFunc);
router.post('/role/create', roleCreateFunc);
router.put('/role/update', roleUpdateFunc);
router.delete('/role/delete', roleDeleteFunc);
router.get('/role/by-group/:nhomId', getRoleByGroup);

// Group routes
router.get('/group/read', groupReadFunc);

module.exports = router;
