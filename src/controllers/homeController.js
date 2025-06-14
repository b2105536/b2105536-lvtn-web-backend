
const db = require('../models/index');
const CRUDService = require('../services/CRUDService');

const getABC = (req, res) => {
    return res.send('Hello World! & nodemon')
}

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

const getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

const postCRUD = async (req, res) => {
    const message = await CRUDService.taoNguoiDung(req.body);
    console.log(message);
    return res.send('Post CRUD from Server');
}

const displayGetCRUD = async (req, res) => {
    let data = await CRUDService.layTatCaNguoiDung();
    return res.render('display-crud.ejs', {
        dataTable: data,
    });
}

const getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.layNguoiDungBangId(userId);
        return res.render('edit-crud.ejs', {
            ttNguoiDung: userData,
        });
    } else {
        return res.send('Không tìm thấy người dùng.');
    }
}

const putCRUD = async (req, res) => {
    let data = req.body;
    let cacNguoiDung = await CRUDService.capNhatTTNguoiDung(data);
    return res.render('display-crud.ejs', {
        dataTable: cacNguoiDung,
    });
}

const deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.xoaNguoiDungBangId(id);
        return res.send('Xóa người dùng thành công.');
    } else {
        return res.send('Không tìm thấy người dùng.');
    }    
}

module.exports = {
    getHomepage, getABC, getCRUD,
    postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD
}