const db = require('../models/index');

const layTatCaMa = async (typeInput) => {
    try {
        if (!typeInput) {
            return {
                EM: 'Không tìm thấy mã nào. (Not found any codes)',
                EC: 1,
                DT: []
            };
        } else {
            let data = await db.BangMa.findAll({
                where: { loai: typeInput },
                attributes: ["id", "tuKhoa", "loai", "giaTri",]
            });
            return {
                EM: 'Lấy tất cả mã thành công! (Get all codes successfully)',
                EC: 0,
                DT: data
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

const layTatCaPhong = async () => {
    try {
        let cacPhong = await db.Phong.findAll({
            attributes: ["id", "tenPhong", "coGacXep", "giaThue", "dienTich", "sucChua"],
            include: [
                { model: db.BangMa, attributes: ["tuKhoa", "loai", "giaTri"] },
                { model: db.Nha, attributes: ["ten"] }
            ]
        });
        if (cacPhong) {
            return {
                EM: 'Lấy dữ liệu thành công! (Get data successfully)',
                EC: 0,
                DT: cacPhong
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

const layPhongTheoTrang = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Phong.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "tenPhong", "coGacXep", "giaThue", "dienTich", "sucChua"],
            include: [
                    { model: db.BangMa, attributes: ["tuKhoa", "loai", "giaTri"] },
                    { model: db.Nha, attributes: ["ten"] }
            ],
            order: [['id', 'DESC']]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            rooms: rows
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

const taoPhong = async (data) => {
    try {
        await db.Phong.create(data);
        return {
            EM: 'Tạo phòng thành công! (Room created successfully)',
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

const capNhatTTPhong = async (data) => {
    try {
        // if (!data.nhaId) {
        //     return {
        //         EM: 'Lỗi! (Empty HouseId)',
        //         EC: 1,
        //         DT: 'nhaId'
        //     };
        // }

        let phongTro = await db.Phong.findOne({
            where: {id: data.id}
        });
        if (phongTro) {
            await phongTro.update({
                tenPhong: data.tenPhong,
                coGacXep: data.coGacXep,
                giaThue: data.giaThue,
                dienTich: data.dienTich,
                sucChua: data.sucChua,
                ttPhongId: data.ttPhongId,
                nhaId: data.nhaId
            });
            return {
                EM: 'Cập nhật phòng thành công! (Room updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy phòng. (Room not found)',
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

const xoaPhongBangId = async (roomId) => {
    try {
        let phongTro = await db.Phong.findOne({
            where: {id: roomId}
        });

        if (phongTro) {
            await phongTro.destroy();

            return {
                EM: 'Xóa phòng thành công! (Room deleted successfully)',
                EC: 0,
                DT: []
            };
        } else {
            return {
                EM: 'Phòng không tồn tại. (Room does not exited)',
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

const layNhaTro = async () => {
    try {
        let cacNha = await db.Nha.findAll({
            attributes: ['id', 'ten', 'chuTroId'],
            order: [['ten', 'ASC']]
        });
        
        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
            EC: 0,
            DT: cacNha
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
    layTatCaMa,
    layTatCaPhong,
    layPhongTheoTrang,
    taoPhong,
    capNhatTTPhong,
    xoaPhongBangId,
    layNhaTro
}