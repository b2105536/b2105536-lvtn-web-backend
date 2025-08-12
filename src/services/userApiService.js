const db = require('../models/index');
const { sdtTonTaiKhong, emailTonTaiKhong, bamMatKhau, kiemTraMatKhau } = require('./loginRegisterService');
const { Op } = require('sequelize');

const layTatCaNguoiDung = async () => {
    try {
        let cacNguoiDung = await db.NguoiDung.findAll({
            attributes: ["id", "soDienThoai", "hoTen", "email", "soDD", "gioiTinh", "ngaySinh", "dcThuongTru", "anhDD"],
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
            attributes: ["id", "soDienThoai", "hoTen", "email", "soDD", "gioiTinh", "ngaySinh", "dcThuongTru", "anhDD"],
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

        if (!nguoiDung) {
            return {
                EM: 'Người dùng không tồn tại. (User does not exist)',
                EC: 2,
                DT: []
            };
        }

        const coNhaSoHuu = await db.Nha.findOne({
            where: { chuTroId: userId }
        });

        if (coNhaSoHuu) {
            return {
                EM: 'Người dùng đang sở hữu nhà, không thể xóa. (Landlord cannot be deleted)',
                EC: 3,
                DT: []
            };
        }

        const coHopDong = await db.HopDong.findOne({
            where: {
                [Op.or]: [
                    { chuTroId: userId },
                    { sinhVienId: userId }
                ]
            }
        });

        if (coHopDong) {
            return {
                EM: 'Người dùng đang có hợp đồng, không thể xóa. (User cannot be deleted)',
                EC: 4,
                DT: []
            };
        }

        await nguoiDung.destroy();

        return {
            EM: 'Xóa người dùng thành công! (User deleted successfully)',
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

const doiMatKhau = async (email, oldPassword, newPassword) => {
    try {
        const user = await db.NguoiDung.findOne({ where: { email } });
        if (!user) {
            return {
                EM: 'Không tìm thấy người dùng.',
                EC: 1
            };
        }

        const matKhauDung = kiemTraMatKhau(oldPassword, user.matKhau);
        if (!matKhauDung) {
            return {
                EM: 'Mật khẩu cũ không đúng.',
                EC: 1
            };
        }

        if (oldPassword === newPassword) {
            return {
                EM: 'Mật khẩu mới phải khác mật khẩu cũ.',
                EC: 1
            };
        }

        if (newPassword.length < 8) {
            return {
                EM: 'Mật khẩu mới phải có ít nhất 8 ký tự.',
                EC: 1
            };
        }

        const hashedPassword = await bamMatKhau(newPassword);
        user.matKhau = hashedPassword;
        await user.save();

        return {
            EM: 'Cập nhật mật khẩu thành công!',
            EC: 0
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

const layTTNguoiDung = async (email) => {
    try {
        if (!email) {
            return {
                EM: 'Không tìm thấy người dùng với email này.',
                EC: 1,
                DT: null
            };
        }

        const data = await db.NguoiDung.findOne({
            where: { email },
            attributes: ['id', 'soDienThoai', 'hoTen', 'email', 'soDD', 'ngaySinh', 'gioiTinh', 'anhDD', 'dcThuongTru']
        });

        if (!data) {
            return {
                EM: 'Không tìm thấy người dùng! (User not found)',
                EC: 1,
                DT: null
            };
        }

        return {
            EM: 'Lấy thông tin người dùng thành công! (Get user info successfully)',
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

const capNhatNguoiDung = async (data) => {
    try {
        if (!data.email) {
            return {
                EM: 'Email không được để trống',
                EC: 1,
                DT: null
            };
        }

        if (!data.hoTen || data.hoTen.trim() === "") {
            return {
                EM: 'Họ tên không được để trống',
                EC: 1,
                DT: null
            };
        }

        let user = await db.NguoiDung.findOne({ where: { email: data.email } });
        if (!user) {
            return {
                EM: 'Người dùng không tồn tại',
                EC: 1,
                DT: null
            };
        }

        user.hoTen = data.hoTen || user.hoTen;
        user.soDD = data.soDD || user.soDD;
        user.gioiTinh = data.gioiTinh;
        user.ngaySinh = data.ngaySinh || user.ngaySinh;
        user.dcThuongTru = data.dcThuongTru || user.dcThuongTru;

        if (data.anhDD && data.anhDD.startsWith('data:image')) {
            user.anhDD = data.anhDD;
        }

        await user.save();

        return {
            EM: 'Cập nhật thông tin thành công! (Infomation updated successfully)',
            EC: 0,
            DT: null
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


module.exports = {
    layTatCaNguoiDung,
    layNguoiDungTheoTrang,
    taoNguoiDung,
    capNhatTTNguoiDung,
    xoaNguoiDungBangId,
    doiMatKhau,
    layTTNguoiDung,
    capNhatNguoiDung
}