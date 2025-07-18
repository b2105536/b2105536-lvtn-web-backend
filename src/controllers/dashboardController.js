const dashboardService = require('../services/dashboardService');

const countUsersByGroup = async (req, res) => {
    try {
        let data = await dashboardService.laySoLuongNguoiDungTheoNhom();
        return res.status(200).json(data);
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
        return res.status(200).json(data);
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
        return res.status(200).json(data);
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
        return res.status(200).json(data);
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
    countHousesByOwner
}

