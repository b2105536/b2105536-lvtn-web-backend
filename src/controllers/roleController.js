const userApiService = require('../services/userApiService');
const roleApiService = require('../services/roleApiService');

const readFunc = async (req, res) => {

}

const createFunc = async (req, res) => {
    try {
        let data = await roleApiService.taoQuyenHan(req.body);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const updateFunc = async (req, res) => {
    
}

const deleteFunc = async (req, res) => {
    
}

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc
}