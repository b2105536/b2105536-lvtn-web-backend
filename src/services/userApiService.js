const db = require('../models/index');

const layTatCaNguoiDung = async () => {
    try {
        let cacNguoiDung = await db.NguoiDung.findAll({
            attributes: ["id", "soDienThoai", "hoTen", "email", "soDD", "gioiTinh", "ngaySinh", "dcThuongTru"],
            include: { model: db.NhomND, attributes: ["tenNhom"] }
        });
        if (cacNguoiDung) {
            return {
                EM: 'Lấy dữ liệu thành công! (Get data successfully)',
                EC: 0,
                DT: cacNguoiDung
            };
        } else {
            return {
                EM: 'Lấy dữ liệu thành công! (Get data successfully)',
                EC: 0,
                DT: []
            };
        }
        
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: []
        };
    }
}

const taoNguoiDung = async (data) => {
    try {
        await db.NguoiDung.create({
            
        });
    } catch (e) {
        console.log(e);
    }
}

const layNguoiDungBangId = (userId) => {
    try {
        
    } catch (e) {
        console.log(e);
    }
}

const capNhatTTNguoiDung = async (data) => {
    try {
        let nguoiDung = await db.NguoiDung.findOne({
            where: {id: data.id}
        });
        if (nguoiDung) {
            nguoiDung.save({

            });
        } else {

        }
    } catch (e) {
        console.log(e);
    }
}

const xoaNguoiDungBangId = async (userId) => {
    try {
        await db.NguoiDung.delete({
            where: {id: userId}
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    layTatCaNguoiDung,
    taoNguoiDung,
    layNguoiDungBangId,
    capNhatTTNguoiDung,
    xoaNguoiDungBangId
}