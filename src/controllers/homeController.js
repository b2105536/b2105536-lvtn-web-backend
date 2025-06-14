
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
    console.log('+++++++++++++++++++++++')
    console.log(data)
    console.log('+++++++++++++++++++++++')

    return res.render('display-crud.ejs', {
        dataTable: data,
    });
}

module.exports = {
    getHomepage, getABC, getCRUD,
    postCRUD, displayGetCRUD,
}