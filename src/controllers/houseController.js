const userApiService = require('../services/userApiService');
const houseApiService = require('../services/houseApiService');


const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await houseApiService.layNhaTheoTrang(+page, +limit);
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        } else {
            let data = await houseApiService.layTatCaNha();
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
        const { ten, diaChi, chuTroId, tinhId, huyenId, xaId } = req.body;
        if (!ten || !diaChi || !chuTroId || !tinhId || !huyenId || !xaId) {
            return res.status(200).json({
                EM: 'Missing required parameters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        let data = await houseApiService.taoNha(req.body);
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
        let data = await houseApiService.capNhatTTNha(req.body);
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
        let data = await houseApiService.xoaNhaBangId(req.body.id);
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

const getUserByGroup = async (req, res) => {
    try {
        let data = await houseApiService.layNguoiDungChuTro();
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

const getProvince = async (req, res) => {
    try {
        let data = await houseApiService.layTinh();
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

const getDistrictByProvince = async (req, res) => {
    try {
        let id = req.params.tinhId;
        let data = await houseApiService.layHuyenTheoTinh(id);
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

const getWardByDistrict = async (req, res) => {
    try {
        let id = req.params.huyenId;
        let data = await houseApiService.layXaTheoHuyen(id);
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
    deleteFunc,
    getUserByGroup,
    getProvince,
    getDistrictByProvince,
    getWardByDistrict
}