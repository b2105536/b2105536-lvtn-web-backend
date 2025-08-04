const homeService = require('../services/homeService');

const homeGetHouse = async (req, res) => {
    try {
        let data = await homeService.layTatCaNha();
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
}

const homeGetHouseDetail = async (req, res) => {
    try {
        const nhaId = req.params.id;
        let data = await homeService.layChiTietNha(nhaId);
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
}

module.exports = {
    homeGetHouse,
    homeGetHouseDetail
}