const bcrypt = require('bcryptjs');
const db = require('../models/index');
const { raw } = require('mysql2');

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
            const hashPassword = await bcrypt.hash(matKhau, 10);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

const layTatCaNguoiDung = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let cacNguoiDung = db.NguoiDung.findAll({raw: true,});
            resolve(cacNguoiDung);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    taoNguoiDung,
    layTatCaNguoiDung
}