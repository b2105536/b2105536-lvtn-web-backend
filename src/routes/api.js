const express = require('express');
const { homeGetHouse } = require('../controllers/homeApiController');
const { handleRegister, handleLogin, handleLogout } = require('../controllers/apiController');
const { countUsersByGroup, countStudentsByGender, countHousesByDistrict, countHousesByOwner, revenueStatistics } = require('../controllers/dashboardController');
const { readFunc, createFunc, updateFunc, deleteFunc, getUserAccount, handleChangePassword, getUserAccountInfo, updateUserAccountInfo } = require('../controllers/userController');
const { readFunc: houseReadFunc,
        createFunc: houseCreateFunc,
        updateFunc: houseUpdateFunc,
        deleteFunc: houseDeleteFunc,
        getUserByGroup,
        getProvince, getDistrictByProvince, getWardByDistrict } = require('../controllers/houseController');
const { getAllCode,
        readFunc: roomReadFunc,
        createFunc: roomCreateFunc,
        updateFunc: roomUpdateFunc,
        deleteFunc: roomDeleteFunc, 
        houseReadFunction,
        getRoomStatuses,
        getRentRanges,
        getAreaRanges,
        getCapacities} = require('../controllers/roomController');
const { readFunc: roleReadFunc,
        createFunc: roleCreateFunc,
        updateFunc: roleUpdateFunc,
        deleteFunc: roleDeleteFunc,
        getRoleByGroup,
        assignRoleToGroup } = require('../controllers/roleController');
const { readFunc: groupReadFunc } = require('../controllers/groupController');
const { getHousesByEmail,
        getRoomsByHouse,
        // readFunc: mngStudentReadFunc,
        createFunc: mngStudentCreateFunc,
        deleteFunc: mngStudentDeleteFunc, 
        serviceCreateFunc,
        serviceReadFunc,
        serviceDeleteFunc,
        serviceUpdateFunc,
        contractReadFunc,
        getServiceByContract, 
        assignServiceToContract,
        createInvoice, 
        getInvoiceInfo,
        getShowInvoiceInfo,
        getInvoiceByContract,
        updateInvoice, 
        getListInvoices,
        getRevenueChart,
        updateRoomNamePrice,
        getStudentInfo,
        updateHouseNameDescription} = require('../controllers/manageController');
const { checkUserJWT, checkUserPermission } = require('../middleware/JWTAction');
const { paymentReadFunc, paymentCreateOrderFunc, paymentCallbackFunc, getInvoiceByEmail, getDetailInvoice } = require('../controllers/paymentController');
const router = express.Router();

router.get('/home/get-house', homeGetHouse);
router.post('/payment/zalopay/callback', paymentCallbackFunc);

// Restful API('/route', api)
router.all('*', checkUserJWT, checkUserPermission);
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/account', getUserAccount);

// Dashboard routes
router.get('/dashboard/user-stats-by-group', countUsersByGroup);
router.get('/dashboard/student-stats-by-gender', countStudentsByGender);
router.get('/dashboard/house-stats-by-district', countHousesByDistrict);
router.get('/dashboard/house-stats-by-owner', countHousesByOwner);
router.get('/dashboard/revenue-statistics', revenueStatistics);

// User routes
router.get('/user/read', readFunc);
router.post('/user/create', createFunc);
router.put('/user/update', updateFunc);
router.delete('/user/delete', deleteFunc);
router.post('/user/change-password', handleChangePassword);

// House routes
router.get('/house/read', houseReadFunc);
router.post('/house/create', houseCreateFunc);
router.put('/house/update', houseUpdateFunc);
router.delete('/house/delete', houseDeleteFunc);
router.get('/house/user-by-group', getUserByGroup);
router.get('/house/province', getProvince);
router.get('/house/district/by-province/:tinhId', getDistrictByProvince);
router.get('/house/ward/by-district/:huyenId', getWardByDistrict);

// Room routes
router.get('/allcode', getAllCode);
router.get('/room/read', roomReadFunc);
router.post('/room/create', roomCreateFunc);
router.put('/room/update', roomUpdateFunc);
router.delete('/room/delete', roomDeleteFunc);
router.get('/room/house-read', houseReadFunction);
router.get('/allcode/stat-rooms', getRoomStatuses);
router.get('/room/rent-range', getRentRanges);
router.get('/room/area-range', getAreaRanges);
router.get('/room/get-capacities', getCapacities);

// Role routes
router.get('/role/read', roleReadFunc);
router.post('/role/create', roleCreateFunc);
router.put('/role/update', roleUpdateFunc);
router.delete('/role/delete', roleDeleteFunc);
router.get('/role/by-group/:nhomId', getRoleByGroup);
router.post('/role/assign', assignRoleToGroup);

// Group routes
router.get('/group/read', groupReadFunc);

// Management routes
router.get('/manage/house-by-email', getHousesByEmail);
router.get('/manage/room-by-house', getRoomsByHouse);
router.post('/manage/student/create', mngStudentCreateFunc);
router.delete('/manage/student/delete', mngStudentDeleteFunc);

router.get('/manage/contract/read', contractReadFunc);

router.post('/manage/service/create', serviceCreateFunc);
router.get('/manage/service/read', serviceReadFunc);
router.delete('/manage/service/delete', serviceDeleteFunc);
router.put('/manage/service/update', serviceUpdateFunc);
router.get('/manage/service/by-contract/:hopDongId', getServiceByContract);
router.post('/manage/service/assign', assignServiceToContract);

router.get('/manage/invoice/by-contract/:hopDongId', getInvoiceInfo);
router.post('/manage/invoice/create', createInvoice);
router.get('/manage/invoice/show/:hopDongId', getShowInvoiceInfo);
router.get('/manage/invoice/read/:hopDongId', getInvoiceByContract);
router.post('/manage/invoice/update', updateInvoice);

router.get('/manage/revenue/list-invoices', getListInvoices);
router.get('/manage/revenue/chart', getRevenueChart);

router.put('/manage/room/update', updateRoomNamePrice);
router.get('/manage/room/student-info', getStudentInfo);

router.put('/manage/house/update', updateHouseNameDescription);

// Other routes
router.get('/payment/info-by-email', paymentReadFunc);
router.post('/payment/zalopay/create-order', paymentCreateOrderFunc);

router.get('/invoice/read', getInvoiceByEmail);
router.get('/invoice/:id', getDetailInvoice);

// Account routes
router.get('/my-account/info', getUserAccountInfo);
router.put('/my-account/update', updateUserAccountInfo);

module.exports = router;
