const userApiService = require('../services/userApiService');
const manageApiService = require('../services/manageApiService');

const getHousesByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                EM: 'Thiếu email. (Missing email)',
                EC: 1,
                DT: []
            });
        }

        let data = await manageApiService.layTatCaNhaTheoChuSoHuu(email);
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
};

const getRoomsByHouse = async (req, res) => {
    try {
        const { nhaId } = req.query;

        let data = await manageApiService.layPhongTheoNha(nhaId);
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

const createFunc = async (req, res) => {
    try {
        const data = req.body;

        if (!data.hoTen || !data.soDienThoai || !data.email || !data.phongId) {
            return res.status(400).json({
                EM: 'Thiếu thông tin bắt buộc! (Missing required parameters)',
                EC: 1,
                DT: null
            });
        }

        const result = await manageApiService.taoHoacThemHopDongKhach(data);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
};

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await userApiService.layNguoiDungTheoTrang(+page, +limit);
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        } else {
            let data = await userApiService.layTatCaNguoiDung();
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

const deleteFunc = async (req, res) => {
    try {
        const { hopDongId, phongId } = req.body;

        if (!hopDongId || !phongId) {
            return res.status(400).json({
                EM: 'Thiếu thông tin hợp đồng hoặc phòng. (Missing information)',
                EC: 1,
                DT: null
            });
        }

        let data = await manageApiService.xoaHopDongBangId(hopDongId, phongId);
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

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'OK', // error message
        EC: 0, // error code
        DT: {
            access_token: req.token,
            quyenCuaNhom: req.user.quyenCuaNhom,
            email: req.user.email,
            hoTen: req.user.hoTen
        } // data (trả về data nên service cũng trả về data)
    });
}

module.exports = {
    getHousesByEmail,
    getRoomsByHouse,
    readFunc,
    createFunc,
    deleteFunc,
    getUserAccount
}