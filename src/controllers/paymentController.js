const paymentService = require('../services/paymentService');
const CryptoJS = require('crypto-js');
const config = require('../config/zalopay.config');

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

const paymentCreateOrderFunc = async (req, res) => {
    try {
        const { amount, email, hoaDonId } = req.body;

        if (!amount || !email || !hoaDonId) {
            return res.status(200).json({
                EM: 'Thiếu thông tin để tạo đơn hàng.',
                EC: 1,
                DT: null
            });
        }

        const data = await paymentService.taoThanhToanZaloPay(amount, email, hoaDonId);

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
};

const paymentCallbackFunc = async (req, res) => {
    try {
        const { data, mac } = req.body;

        if (!data || !mac) {
            console.log("Thiếu data hoặc mac:", req.body);
            return res.status(400).json({ return_code: -1, return_message: 'Thiếu data hoặc mac' });
        }

        const calculatedMac = CryptoJS.HmacSHA256(data, config.key2).toString(CryptoJS.enc.Hex);

        if (mac !== calculatedMac) {
            return res.status(400).json({ return_code: -1, return_message: 'MAC không khớp' });
        }

        const decodedData = JSON.parse(data);

        const { amount, embed_data } = decodedData;
        const { hoaDonId } = JSON.parse(embed_data);

        const result = await paymentService.capNhatHoaDonSauKhiThanhToan(hoaDonId, amount);

        return res.json({ return_code: 1, return_message: "success" });
    } catch (err) {
        console.error("ZaloPay callback error:", err);
        return res.status(500).json({ return_code: -1, return_message: "Server error" });
    }
};

module.exports = {
    paymentReadFunc,
    paymentCreateOrderFunc,
    paymentCallbackFunc
}