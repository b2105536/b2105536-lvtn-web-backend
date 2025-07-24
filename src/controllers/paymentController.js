const paymentService = require('../services/paymentService');

const paymentReadFunc = async (req, res) => {
    try {
        const email = req.query.email;
        
        if (!email) {
            return res.status(200).json({
                EM: 'Thiếu email sinh viên.', // error message
                EC: '1', // error code
                DT: '' // data
            });
        }
        
        let data = await paymentService.layThongTinGiayBaoTheoEmail(email);
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
    paymentReadFunc
}