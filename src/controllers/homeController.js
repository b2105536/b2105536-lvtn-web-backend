
const db = require('../models/index');
const userService = require('../services/userService');

const getHomepage = async (req, res) => {
    try {
        let data = await db.NguoiDung.findAll();
        return res.render('sample.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}

const getAddUserPage = (req, res) => {
    return res.render('create-user.ejs')
}

const handleCreateNewUser = async (req, res) => {
    try {
        const message = await userService.taoNguoiDung(req.body);
        console.log(message);
        return res.redirect('/users');
    } catch (e) {
        console.log(e)
    }
    
}

const getUserPage = async (req, res) => {
    let data = await userService.layTatCaNguoiDung();
    return res.render('display-user.ejs', {
        dataTable: data,
    });
}

const getEditUserPage = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await userService.layNguoiDungBangId(userId);
        return res.render('edit-user.ejs', {
            ttNguoiDung: userData,
        });
    } else {
        return res.send('Không tìm thấy người dùng.');
    }
}

const handleUpdateUser = async (req, res) => {
    let data = req.body;
    // let cacNguoiDung = await userService.capNhatTTNguoiDung(data);
    // return res.render('display-user.ejs', {
    //     dataTable: cacNguoiDung,
    // });
    await userService.capNhatTTNguoiDung(data);
    return res.redirect('/users');
}

const handleDeleteUser = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await userService.xoaNguoiDungBangId(id);
        return res.redirect('/users');
    } else {
        return res.send('Không tìm thấy người dùng.');
    }    
}

module.exports = {
    getHomepage,
    getAddUserPage,
    handleCreateNewUser,
    getUserPage,
    getEditUserPage,
    handleUpdateUser,
    handleDeleteUser
}