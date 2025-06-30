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
                nhomId: data.nhomId
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

const layNguoiDungBangId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = await db.NguoiDung.findOne({
                where: { id: userId },
                raw: true,
            });

            if (nguoiDung) {
                resolve(nguoiDung);
            } else {
                resolve([]);
            } 
        } catch (e) {
            reject(e);
        }
    })
}

const capNhatTTNguoiDung = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = await db.NguoiDung.findOne({
                where: { id: data.id }
            });
            if (nguoiDung) {
                nguoiDung.hoTen = data.hoTen;
                nguoiDung.email = data.email;
                nguoiDung.soDD = data.soDD;
                nguoiDung.gioiTinh = data.gioiTinh;
                nguoiDung.ngaySinh = data.ngaySinh;
                nguoiDung.dcThuongTru = data.dcThuongTru;

                await nguoiDung.save();

                let cacNguoiDung = await db.NguoiDung.findAll();
                resolve(cacNguoiDung);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

const xoaNguoiDungBangId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nguoiDung = await db.NguoiDung.findOne({
                where: { id: userId }
            });

            if (nguoiDung) {
                await nguoiDung.destroy();
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    taoNguoiDung,
    layTatCaNguoiDung,
    layNguoiDungBangId,
    capNhatTTNguoiDung,
    xoaNguoiDungBangId
}