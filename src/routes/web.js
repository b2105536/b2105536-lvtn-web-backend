const express = require('express');
const { getHomepage,
        getAddUserPage,
        handleCreateNewUser,
        getUserPage,
        getEditUserPage,
        handleUpdateUser,
        handleDeleteUser } = require('../controllers/homeController');
const { testApi } = require('../controllers/apiController');
const router = express.Router();

// router.Method('/route', handler)
router.get('/', getHomepage);
router.get('/add-user', getAddUserPage);
router.get('/users', getUserPage);
router.get('/edit-user', getEditUserPage);

router.post('/create-user', handleCreateNewUser);
router.post('/update-user', handleUpdateUser);
router.get('/delete-user', handleDeleteUser);

// Restful API
router.get('/api/test-api', testApi);

module.exports = router;
