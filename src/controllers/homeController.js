

const getHomepage = (req, res) => {
    res.send('Hello World! & nodemon')
}

const getABC = (req, res) => {
    res.render('sample.ejs')
}

module.exports = {
    getHomepage, getABC
}