const express = require('express');
const { getHomepage,
        getAddUserPage,
        handleCreateNewUser,
        getUserPage,
        getEditUserPage,
        handleUpdateUser,
        handleDeleteUser } = require('../controllers/homeController');
const router = express.Router();

// router.Method('/route', handler)
router.get('/', getHomepage);
router.get('/add-user', getAddUserPage);
router.get('/users', getUserPage);
router.get('/edit-user', getEditUserPage);

router.post('/create-user', handleCreateNewUser);
router.post('/update-user', handleUpdateUser);
router.get('/delete-user', handleDeleteUser);

module.exports = router;
