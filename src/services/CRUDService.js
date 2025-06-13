const bcrypt = require('bcryptjs');
const db = require('../models/index');

const salt = bcrypt.genSaltSync(10);

const taoNguoiDung = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await bamMatKhau(data.matKhau);
            await db.NguoiDung.create({
                soDienThoai: data.soDienThoai,
                matKhau: hashPasswordFromBcrypt,
                hoTen: data.hoTen,
                email: data.email,
                soDD: data.soDD,
                gioiTinh: data.gioiTinh === '1' ? true : false,
                ngaySinh: data.ngaySinh,
                dcThuongTru: data.dcThuongTru,
                anhDD: data.anhDD,
                quyenHan: data.quyenHan
            });
            resolve('Create a new user successfully!');
        } catch (e) {
            reject(e);
        }
    })
}

const bamMatKhau = (matKhau) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = bcrypt.hashSync(matKhau, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    taoNguoiDung
}