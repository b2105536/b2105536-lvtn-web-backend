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
            // // Lấy thông tin người dùng và nhóm người dùng mà họ thuộc về:
            // let nguoiDungMoi = await db.NguoiDung.findOne({
            //     where: { id: 1 },
            //     attributes: ["id", "soDienThoai", "hoTen"],
            //     include: { model: db.NhomND, attributes: ["tenNhom"] },
            //     nest: true,
            //     raw: true
            // })
            
            // // Lấy tất cả các quyền:
            // // Cách 1 (chọn):
            // let cacQuyen = await db.Quyen.findAll({
            //     attributes: ["url", "quyenHan"],
            //     include: { model: db.NhomND, where: { id: 1 } },
            //     nest: true,
            //     raw: true
            // })
            // // Cách 2:
            // let cacQuyen = await db.NhomND.findAll({
            //     where: { id: 1 },
            //     include: db.Quyen,
            //     nest: true,
            //     raw: true
            // })

            // // Lấy một hóa đơn và tất cả các chi tiết dịch vụ của nó:
            // let hoaDonVaChiTiet = await db.HoaDon.findAll({
            //     where: { id: 1 },
            //     include: {
            //         model: db.DichVu,
            //         through: {
            //             attributes: ['slSuDung', 'dgApDung', 'thanhTien']
            //         },
            //         attributes: ['tenDV', 'donViTinh']
            //     },
            //     nest: true,
            //     raw: true
            // });

            // console.log('>>> Check bill: ', JSON.stringify(hoaDonVaChiTiet, null, 2));
            // console.log('>>> Check group: ', nguoiDungMoi);
            // console.log('>>> Check roles: ', cacQuyen);

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