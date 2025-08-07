const db = require('../models/index');
const { Sequelize, Op } = require('sequelize');

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

const layPhongTheoTrang = async (page, limit, nhaId, ttPhongId, giaThueTu, giaThueDen, dienTichTu, dienTichDen, sucChua, coGacXep, taiSanId) => {
    try {
        let offset = (page - 1) * limit;
        let whereClause = {};
        let includeClause = [
            { model: db.BangMa, attributes: ["id", "tuKhoa", "loai", "giaTri"] },
            { model: db.Nha, attributes: ["id", "ten"] }
        ];

        if (nhaId && nhaId !== 'ALL') {
            whereClause.nhaId = +nhaId;
        }

        if (ttPhongId && ttPhongId !== 'ALL') {
            whereClause.ttPhongId = ttPhongId;
        }

        if (giaThueTu && giaThueDen) {
            whereClause.giaThue = {
                [Op.between]: [Number(giaThueTu), Number(giaThueDen)]
            };
        } else if (giaThueTu) {
            whereClause.giaThue = { [Op.gte]: Number(giaThueTu) };
        } else if (giaThueDen) {
            whereClause.giaThue = { [Op.lte]: Number(giaThueDen) };
        }

        if (dienTichTu && dienTichDen) {
            whereClause.dienTich = {
                [Op.between]: [Number(dienTichTu), Number(dienTichDen)]
            };
        } else if (dienTichTu) {
            whereClause.dienTich = { [Op.gte]: Number(dienTichTu) };
        } else if (dienTichDen) {
            whereClause.dienTich = { [Op.lte]: Number(dienTichDen) };
        }

        if (sucChua && sucChua !== 'ALL') {
            whereClause.sucChua = +sucChua;
        }

        if (coGacXep && coGacXep !== 'ALL') {
            whereClause.coGacXep = coGacXep === 'true';
        }

        if (taiSanId && taiSanId !== 'ALL') {
            includeClause.push({
                model: db.TaiSan,
                through: { attributes: [] },
                where: { id: +taiSanId },
                required: true
            });
        }

        const { count, rows } = await db.Phong.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereClause,
            attributes: ["id", "tenPhong", "coGacXep", "giaThue", "dienTich", "sucChua"],
            include: includeClause,
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
        if (!data.ttPhongId || !data.nhaId) {
            return {
                EM: 'Lỗi! (Empty)',
                EC: 1,
                DT: !data.ttPhongId ? 'ttPhongId' : 'nhaId'
            };
        }

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
            where: {id: roomId},
            include: [{
                model: db.HopDong,
                where: { ttHopDongId: 8 },
                required: false
            }]
        });

        if (!phongTro) {
            return {
                EM: 'Phòng không tồn tại. (Room does not exited)',
                EC: 2,
                DT: []
            };
        }

        if (phongTro.HopDongs?.length > 0) {
            return {
                EM: 'Phòng đang có hợp đồng thuê, không thể xóa. (Room is under lease, cannot be deleted)',
                EC: 3,
                DT: []
            };
        }
        
        await phongTro.destroy();

        return {
            EM: 'Xóa phòng thành công! (Room deleted successfully)',
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

const layKhoangGia = async () => {
    try {
        let ranges = [
            { id: 1, label: 'Dưới 1 triệu', giaThueTu: 0, giaThueDen: 1000000 },
            { id: 2, label: '1 - 1.5 triệu', giaThueTu: 1000000, giaThueDen: 1500000 },
            { id: 3, label: '1.5 - 2 triệu', giaThueTu: 1500000, giaThueDen: 2000000 },
            { id: 4, label: 'Trên 2 triệu', giaThueTu: 2000000, giaThueDen: null },
        ];
        
        return {
            EM: 'Lấy danh sách khoảng giá thành công! (Get list of rent ranges successfully)',
            EC: 0,
            DT: ranges
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

const layKhoangDienTich = async () => {
    try {
        let ranges = [
            { id: 1, label: '≤ 10 m²', dienTichTu: 0, dienTichDen: 10 },
            { id: 2, label: '11 - 15 m²', dienTichTu: 11, dienTichDen: 15 },
            { id: 3, label: '16 - 20 m²', dienTichTu: 16, dienTichDen: 20 },
            { id: 4, label: '21 - 25 m²', dienTichTu: 21, dienTichDen: 25 },
            { id: 5, label: '26 - 30 m²', dienTichTu: 26, dienTichDen: 30 },
            { id: 6, label: '> 30 m²', dienTichTu: 31, dienTichDen: null },
        ];
        
        return {
            EM: 'Lấy danh sách khoảng diện tích thành công! (Get list of area ranges successfully)',
            EC: 0,
            DT: ranges
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

const laySucChua = async () => {
    try {
        let data = await db.Phong.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('sucChua')), 'sucChua']
            ],
            order: [['sucChua', 'ASC']]
        });

        const result = data.map(item => item.get('sucChua'));
        
        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
            EC: 0,
            DT: result
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
    layNhaTro,
    layKhoangGia,
    layKhoangDienTich,
    laySucChua
}