const contractService = require('../services/contractService');

const contractReadByIdFunc = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await contractService.layHopDongTheoId(id);
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

const contractUpdateFunc = async (req, res) => {
    try {
        let id = req.params.id;
        let { ngayKT, tienDatCoc } = req.body;
        let data = await contractService.capNhatHopDong(id, { ngayKT, tienDatCoc });
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
    contractReadByIdFunc,
    contractUpdateFunc
}