const loginRegisterService = require('../services/loginRegisterService');

const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    });
}

const handleRegister = async (req, res) => {
    try {
        if (!req.body.soDienThoai || !req.body.email || !req.body.matKhau) {
            return res.status(200).json({
                EM: 'Missing required parameters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        if (req.body.matKhau && req.body.matKhau.length < 8) {
            return res.status(200).json({
                EM: 'Your password must have at least 8 characters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        // Service: Create user
        let data = await loginRegisterService.taoTaiKhoanNguoiDung(req.body);

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: '' // data
        });
    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const handleLogin = async (req, res) => {
    try {
        let data = await loginRegisterService.dangNhapTaiKhoan(req.body);

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

module.exports = {
    testApi,
    handleRegister,
    handleLogin
}