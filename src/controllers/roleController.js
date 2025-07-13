const userApiService = require('../services/userApiService');
const roleApiService = require('../services/roleApiService');

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await roleApiService.layQuyenTheoTrang(+page, +limit);
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        } else {
            let data = await roleApiService.layTatCaQuyen();
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
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
    try {
        let data = await roleApiService.capNhatQuyen(req.body);
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

const deleteFunc = async (req, res) => {
    try {
        let data = await roleApiService.xoaQuyenBangId(req.body.id);
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

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc
}