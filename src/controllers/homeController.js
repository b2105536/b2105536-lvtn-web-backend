
const db = require('../models/index');
const CRUDService = require('../services/CRUDService');

const getABC = (req, res) => {
    res.send('Hello World! & nodemon')
}

const getHomepage = async (req, res) => {
    try {
        let data = await db.NguoiDung.findAll();
        res.render('sample.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}

const getCRUD = (req, res) => {
    res.render('crud.ejs')
}

const postCRUD = async (req, res) => {
    const message = await CRUDService.taoNguoiDung(req.body);
    console.log(message);
    res.send('Post CRUD from Server');
}

module.exports = {
    getHomepage, getABC, getCRUD,
    postCRUD,
}