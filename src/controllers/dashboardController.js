const dashboardService = require('../services/dashboardService');

const countUsersByGroup = async (req, res) => {
    try {
        let data = await dashboardService.laySoLuongNguoiDungTheoNhom();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
};

const countStudentsByGender = async (req, res) => {
    try {
        let data = await dashboardService.thongKeSinhVienTheoGioiTinh();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
};

const countHousesByDistrict = async (req, res) => {
    try {
        let data = await dashboardService.laySoLuongNhaTroTheoHuyen();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
};

const countHousesByOwner = async (req, res) => {
    try {
        let data = await dashboardService.laySoLuongNhaTroTheoChuSoHuu();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
};

const revenueStatistics = async (req, res) => {
    try {
        let { nhaId, type, fromDate, toDate } = req.query;

        nhaId = (nhaId === 'null' || nhaId === 'undefined' || !nhaId) ? null : nhaId;

        let filter = {
            nhaId,
            type: type || 'month',
            fromDate: fromDate || null,
            toDate: toDate || null
        };

        let data = await dashboardService.thongKeDoanhThuTatCaNhaTro(filter);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
};

module.exports = {
    countUsersByGroup,
    countStudentsByGender,
    countHousesByDistrict,
    countHousesByOwner,
    revenueStatistics
}

