
const db = require('../models/index');

const getHomepage = (req, res) => {
    res.send('Hello World! & nodemon')
}

const getABC = async (req, res) => {
    try {
        let data = await db.User.findAll();
        res.render('sample.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getHomepage, getABC
}