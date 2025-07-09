const bcrypt = require('bcryptjs');
const db = require('../models/index');
const { Op } = require('sequelize');

const bamMatKhau = (matKhau) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hash(matKhau, 10);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

const sdtTonTaiKhong = async (userMobile) => {
    let nguoiDung = await db.NguoiDung.findOne({
        where: { soDienThoai: userMobile }
    })

    if (nguoiDung) {
        return true;
    }

    return false;
}

const emailTonTaiKhong = async (userEmail) => {
    let nguoiDung = await db.NguoiDung.findOne({
        where: { email: userEmail }
    })

    if (nguoiDung) {
        return true;
    }

    return false;
}

const taoTaiKhoanNguoiDung = async (rawUserData) => {
    try {
        let tonTaiSoDienThoai = await sdtTonTaiKhong(rawUserData.soDienThoai);
        if (tonTaiSoDienThoai === true) {
            return {
                EM: 'Số điện thoại này đã tồn tại. (This mobile has already existed)',
                EC: 1
            };
        }

        let tonTaiEmail = await emailTonTaiKhong(rawUserData.email);
        if (tonTaiEmail === true) {
            return {
                EM: 'Email này đã tồn tại. (This email has already existed)',
                EC: 1
            };
        }

        let hashPassword = await bamMatKhau(rawUserData.matKhau);

        await db.NguoiDung.create({
            soDienThoai: rawUserData.soDienThoai,
            hoTen: rawUserData.hoTen,
            email: rawUserData.email,
            matKhau: hashPassword
        });

        return {
            EM: 'Đăng ký tài khoản thành công! (An user was created successfully)',
            EC: 0
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: -2
        };
    }
}

const kiemTraMatKhau = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}

const dangNhapTaiKhoan = async (rawData) => {
    try {
        let nguoiDung = await db.NguoiDung.findOne({
            where: {
                [Op.or]: [
                    { soDienThoai: rawData.valueLogin },
                    { email: rawData.valueLogin }
                ]
            }
        });

        if (nguoiDung) {
            console.log(">>> User was found")
            let matKhauDung = kiemTraMatKhau(rawData.matKhau, nguoiDung.matKhau);
            if (matKhauDung === true) {
                return {
                    EM: 'OK',
                    EC: 0,
                    DT: ''
                };
            }
        }
        
        console.log(">>> User not found with email/mobile: ", rawData.valueLogin, "& password: ", rawData.matKhau);
        return {
            EM: 'Thông tin bạn nhập không chính xác. (The information you entered is incorrect)',
            EC: 1,
            DT: ''
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: -2
        };
    }
}

module.exports = {
    taoTaiKhoanNguoiDung,
    dangNhapTaiKhoan,
    sdtTonTaiKhong
}