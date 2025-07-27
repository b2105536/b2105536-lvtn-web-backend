const db = require('../models/index');
const { sdtTonTaiKhong, emailTonTaiKhong, bamMatKhau } = require('./loginRegisterService');

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

const layNguoiDungTheoTrang = async (page, limit, nhomId) => {
    try {
        let offset = (page - 1) * limit;
        let whereClause = {};
        if (nhomId && nhomId !== 'ALL') {
            whereClause.nhomId = +nhomId;
        }

        const { count, rows } = await db.NguoiDung.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereClause,
            attributes: ["id", "soDienThoai", "hoTen", "email", "soDD", "gioiTinh", "ngaySinh", "dcThuongTru"],
            include: { model: db.NhomND, attributes: ["id", "tenNhom"] },
            order: [['id', 'DESC']]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        };

        return {
            EM: 'Ok! (Fetch ok)',
            EC: 0,
            DT: data
        };
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
        let tonTaiSoDienThoai = await sdtTonTaiKhong(data.soDienThoai);
        if (tonTaiSoDienThoai === true) {
            return {
                EM: 'Số điện thoại này đã tồn tại. (This mobile has already existed)',
                EC: 1,
                DT: 'soDienThoai'
            };
        }
        
        let tonTaiEmail = await emailTonTaiKhong(data.email);
        if (tonTaiEmail === true) {
            return {
                EM: 'Email này đã tồn tại. (This email has already existed)',
                EC: 1,
                DT: 'email'
            };
        }

        let hashPassword = await bamMatKhau(data.matKhau);

        await db.NguoiDung.create({...data, matKhau: hashPassword});
        return {
            EM: 'Tạo người dùng thành công! (User created successfully)',
            EC: 0,
            DT: []
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: []
        };
    }
}

const capNhatTTNguoiDung = async (data) => {
    try {
        if (!data.nhomId) {
            return {
                EM: 'Lỗi! (Empty GroupId)',
                EC: 1,
                DT: 'nhomId'
            };
        }

        let nguoiDung = await db.NguoiDung.findOne({
            where: {id: data.id}
        });
        if (nguoiDung) {
            await nguoiDung.update({
                hoTen: data.hoTen,
                soDD: data.soDD,
                gioiTinh: data.gioiTinh,
                ngaySinh: data.ngaySinh,
                dcThuongTru: data.dcThuongTru,
                anhDD: data.anhDD,
                nhomId: data.nhomId
            });
            return {
                EM: 'Cập nhật người dùng thành công! (User updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy người dùng. (User not found)',
                EC: 2,
                DT: ''
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

const xoaNguoiDungBangId = async (userId) => {
    try {
        let nguoiDung = await db.NguoiDung.findOne({
            where: {id: userId}
        });

        if (nguoiDung) {
            await nguoiDung.destroy();

            return {
                EM: 'Xóa người dùng thành công! (User deleted successfully)',
                EC: 0,
                DT: []
            };
        } else {
            return {
                EM: 'Người dùng không tồn tại. (User does not exited)',
                EC: 2,
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

module.exports = {
    layTatCaNguoiDung,
    layNguoiDungTheoTrang,
    taoNguoiDung,
    capNhatTTNguoiDung,
    xoaNguoiDungBangId
}