const db = require('../models/index');
const { sdtTonTaiKhong, emailTonTaiKhong, bamMatKhau } = require('./loginRegisterService');

const layTatCaNhaTheoChuSoHuu = async (email) => {
    try {
        let nguoiDung = await db.NguoiDung.findOne({
            where: { email },
            attributes: ['id', 'hoTen']
        });

        if (!nguoiDung) {
            return {
                EM: 'Không tìm thấy người dùng. (User not found)',
                EC: 1,
                DT: []
            };
        }

        let danhSachNha = await db.Nha.findAll({
            where: { chuTroId: nguoiDung.id },
            attributes: ['id', 'ten'],
            order: [['id', 'DESC']]
        });

        return {
            EM: 'Lấy danh sách nhà thành công! (Fetched successfully)',
            EC: 0,
            DT: danhSachNha
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong)',
            EC: 1,
            DT: []
        };
    }
};

const layPhongTheoNha = async (nhaId) => {
    try {
        if (!nhaId) {
            return {
                EM: 'Thiếu nhaId (Missing nhaId)',
                EC: 1,
                DT: []
            };
        }

        const danhSachPhong = await db.Phong.findAll({
            where: { nhaId: nhaId },
            attributes: ['id', 'tenPhong', 'coGacXep', 'giaThue', 'dienTich', 'sucChua', 'ttPhongId', 'nhaId'],
            order: [['tenPhong', 'ASC']],
            include: [
                {
                    model: db.HopDong,
                    where: { ngayKT: null },
                    required: false,
                    include: [
                        {
                            model: db.NguoiDung,
                            attributes: ['id', 'hoTen']
                        }
                    ]
                }
            ]
        });

        const phongCoTrangThai = danhSachPhong.map(phong => {
            const hopDong = phong.HopDongs?.[0];
            const sinhVien = hopDong?.NguoiDung;

            return {
                ...phong.toJSON(),
                daChoThue: !!hopDong,
                hopDongId: hopDong?.id || null,
                sinhVienThue: sinhVien ? { id: sinhVien.id, hoTen: sinhVien.hoTen } : null
            };
        });

        return {
            EM: 'Lấy danh sách phòng thành công! (Fetched successfully)',
            EC: 0,
            DT: phongCoTrangThai
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong)',
            EC: 1,
            DT: []
        };
    }
}

const taoHoacThemHopDongKhach = async (data) => {
    try {
        const chuTro = await db.NguoiDung.findOne({
            where: { email: data.emailChuTro }
        });
        if (!chuTro) {
            return {
                EM: 'Không tìm thấy chủ trọ!',
                EC: 1,
                DT: null
            };
        }

        let nguoiDung = await db.NguoiDung.findOne({
            where: {
                email: data.email,
                soDienThoai: data.soDienThoai
            },
            attributes: ['id', 'email', 'soDienThoai', 'nhomId']
        });
        if (!nguoiDung) {
            return {
                EM: 'Người dùng không tồn tại trong hệ thống.',
                EC: 1,
                DT: null
            };
        }
        if (nguoiDung.nhomId !== 3) {
            return {
                EM: 'Chỉ người dùng thuộc nhóm sinh viên mới được thêm!',
                EC: 1,
                DT: null
            };
        }

        const daCoHopDong = await db.HopDong.findOne({
            where: {
                sinhVienId: nguoiDung.id,
                ngayKT: null
            }
        });
        if (daCoHopDong) {
            return {
                EM: 'Người dùng đã có hợp đồng ở phòng khác.',
                EC: 1,
                DT: null
            };
        }

        const tonTai = await db.HopDong.findOne({
            where: {
                sinhVienId: nguoiDung.id,
                phongId: data.phongId
            }
        });
        if (tonTai) {
            return {
                EM: 'Khách này đã được thêm vào phòng này.',
                EC: 1,
                DT: null
            };
        }

        const newHopDong = await db.HopDong.create({
            ngayLap: new Date(),
            phongId: data.phongId,
            sinhVienId: nguoiDung.id,
            ngayBD: new Date(),
            chuTroId: chuTro.id,
            giaThueTrongHD: data.giaThue,
            ttHopDongId: 8
        });

        await db.Phong.update(
            { ttPhongId: 5 },
            { where: { id: data.phongId } }
        );

        return {
            EM: 'Thêm khách vào phòng thành công!',
            EC: 0,
            DT: newHopDong
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: null
        };
    }
};

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

const layNguoiDungTheoTrang = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.NguoiDung.findAndCountAll({
            offset: offset,
            limit: limit,
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

const xoaHopDongBangId = async (hopDongId, phongId) => {
    try {
        let hopDong = await db.HopDong.findOne({
            where: {id: hopDongId}
        });

        if (!hopDong) {
            return {
                EM: 'Hợp đồng không tồn tại!',
                EC: 1,
                DT: null
            };
        }

        
        await db.HopDong.destroy({ where: { id: hopDongId } });

        await db.Phong.update(
            { ttPhongId: 6 },
            { where: { id: phongId } }
        );

        return {
            EM: 'Xóa hợp đồng thành công! (Contract deleted successfully)',
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

module.exports = {
    layTatCaNhaTheoChuSoHuu,
    layPhongTheoNha,
    taoHoacThemHopDongKhach,
    layTatCaNguoiDung,
    layNguoiDungTheoTrang,
    taoNguoiDung,
    xoaHopDongBangId
}