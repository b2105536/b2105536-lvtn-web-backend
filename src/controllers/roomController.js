const roomApiService = require('../services/roomApiService');

const getAllCode = async (req, res) => {
    try {
        let data = await roomApiService.layTatCaMa(req.query.loai);
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

const readFunc = async (req, res) => {
    try {
        let { page, limit, nhaId, ttPhongId, giaThueTu, giaThueDen, dienTichTu, dienTichDen, sucChua, coGacXep, taiSanId } = req.query;

        if (page && limit && nhaId) {
            let data = await roomApiService.layPhongTheoTrang(
                +page, +limit, nhaId, ttPhongId, giaThueTu, giaThueDen, dienTichTu, dienTichDen, sucChua, coGacXep, taiSanId
            );

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } else {
            let data = await roomApiService.layTatCaPhong();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const createFunc = async (req, res) => {
    try {
        const { tenPhong, giaThue, dienTich, sucChua, nhaId, ttPhongId } = req.body;

        if (!tenPhong || !giaThue || !dienTich || !sucChua || !nhaId || !ttPhongId) {
            return res.status(200).json({
                EM: 'Missing required parameters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        let data = await roomApiService.taoPhong(req.body);
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
        let data = await roomApiService.capNhatTTPhong(req.body);
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
        let data = await roomApiService.xoaPhongBangId(req.body.id);
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

const houseReadFunction = async (req, res) => {
    try {
        let data = await roomApiService.layNhaTro();
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

const getRoomStatuses = async (req, res) => {
    try {
        let data = await roomApiService.layTatCaMa('TTPHONG');
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
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

const getRentRanges = async (req, res) => {
    try {
        const data = await roomApiService.layKhoangGia();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
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

const getAreaRanges = async (req, res) => {
    try {
        const data = await roomApiService.layKhoangDienTich();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
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

const getCapacities = async (req, res) => {
    try {
        const data = await roomApiService.laySucChua();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
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
    getAllCode,
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    houseReadFunction,
    getRoomStatuses,
    getRentRanges,
    getAreaRanges,
    getCapacities
}