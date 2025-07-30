const userApiService = require('../services/userApiService');

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit && req.query.nhomId) {
            let page = req.query.page;
            let limit = req.query.limit;
            let nhomId = req.query.nhomId;

            let data = await userApiService.layNguoiDungTheoTrang(+page, +limit, nhomId);
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        } else {
            let data = await userApiService.layTatCaNguoiDung();
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const createFunc = async (req, res) => {
    try {
        const { soDienThoai, email, nhomId, matKhau } = req.body;
        const regxMobile = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
        const regxEmail = /\S+@\S+\.\S+/;

        if (!soDienThoai || !email || !nhomId || !matKhau) {
            return res.status(200).json({
                EM: 'Missing required parameters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        if (!regxMobile.test(soDienThoai)) {
            return res.status(200).json({
                EM: 'Mobile is invalid',
                EC: '1',
                DT: ''
            });
        }

        if (!regxEmail.test(email)) {
            return res.status(200).json({
                EM: 'Email is invalid',
                EC: '1',
                DT: ''
            });
        }

        if (matKhau && matKhau.length < 8) {
            return res.status(200).json({
                EM: 'Your password must have at least 8 characters', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }

        let data = await userApiService.taoNguoiDung(req.body);
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
        let data = await userApiService.capNhatTTNguoiDung(req.body);
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
        let data = await userApiService.xoaNguoiDungBangId(req.body.id);
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

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'OK', // error message
        EC: 0, // error code
        DT: {
            access_token: req.token,
            quyenCuaNhom: req.user.quyenCuaNhom,
            email: req.user.email,
            hoTen: req.user.hoTen
        } // data (trả về data nên service cũng trả về data)
    });
}

const handleChangePassword = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const { oldPassword, newPassword } = req.body;

        const data = await userApiService.doiMatKhau(userEmail, oldPassword, newPassword);
        
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: '' // data
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

const getUserAccountInfo = async (req, res) => {
    try {
        const email = req.user?.email || req.query?.email;
        const data = await userApiService.layTTNguoiDung(email);

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

const updateUserAccountInfo = async (req, res) => {
    try {
        const data = await userApiService.capNhatNguoiDung(req.body);
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
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    getUserAccount,
    handleChangePassword,
    getUserAccountInfo,
    updateUserAccountInfo
}