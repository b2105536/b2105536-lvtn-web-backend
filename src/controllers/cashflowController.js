const cashflowService = require('../services/cashflowService');

const getCashflowByHouse = async (req, res) => {
    try {
        const { houseId } = req.query;

        if (!houseId) {
            return res.status(400).json({
                EM: 'Thiếu houseId. (Missing houseId)',
                EC: 1,
                DT: []
            });
        }

        let data = await cashflowService.layDongTienTheoNha(houseId);
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

const updateDeposit = async (req, res) => {
    try {
        const { roomId, tienDatCoc } = req.body;
        if (!roomId || tienDatCoc === undefined) {
            return res.status(200).json({
                EC: 1,
                EM: "Thiếu thông tin bắt buộc (Missing required parameters)",
                DT: []
            });
        }

        const result = await cashflowService.hoanTraCoc(roomId, tienDatCoc);
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
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

const payDebt = async (req, res) => {
    try {
        const { roomId, amount } = req.body;

        if (!roomId || amount === undefined) {
            return res.status(200).json({
                EC: 1,
                EM: "Thiếu thông tin bắt buộc (Missing required parameters)",
                DT: []
            });
        }

        if (Number(amount) <= 0) {
            return res.status(200).json({
                EC: 2,
                EM: "Số tiền phải lớn hơn 0 (Amount must be greater than 0)",
                DT: []
            });
        }

        const result = await cashflowService.thuTienNo(roomId, Number(amount));
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'Error from server',
            EC: -1,
            DT: []
        });
    }
}

module.exports = {
    getCashflowByHouse,
    updateDeposit,
    payDebt
}
