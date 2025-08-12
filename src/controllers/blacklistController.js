const blacklistService = require('../services/blacklistService');

const addToBlacklist = async (req, res) => {
    try {
        let { sinhVienId, lyDo } = req.body;
        let data = await blacklistService.themVaoBlacklist({ sinhVienId, lyDo });
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
        });
    }
}

const removeFromBlacklist = async (req, res) => {
    try {
        let { sinhVienId } = req.params;
        let data = await blacklistService.boKhoiBlacklist({ sinhVienId });
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: ""
        });
    }
}

module.exports = {
    addToBlacklist,
    removeFromBlacklist
}