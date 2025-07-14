const db = require('../models/index');

const taoQuyenHan = async (roles) => {
    try {
        let quyenHienThoi = await db.Quyen.findAll({
            attributes: ['url', 'quyenHan'],
            raw: true
        });

        const persists = roles.filter(({ url: url1 }) =>
            !quyenHienThoi.some(({ url: url2 }) => url1 === url2)
        );
        
        if (persists.length === 0) {
            return {
                EM: 'Không có quyền để tạo. (Nothing to create)',
                EC: 0,
                DT: []
            };
        }
        await db.Quyen.bulkCreate(persists);
        return {
                EM: `Tạo ${persists.length} quyền thành công! (Role(s) created successfully)`,
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

const layTatCaQuyen = async () => {
    try {
        let data = await db.Quyen.findAll({
            attributes: ["id", "url", "quyenHan"],
            order: [['id', 'DESC']]
        });
        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
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

const layQuyenTheoTrang = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Quyen.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "url", "quyenHan"],
            order: [['id', 'DESC']]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            roles: rows
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

const xoaQuyenBangId = async (id) => {
    try {
        let quyen = await db.Quyen.findOne({
            where: {id: id}
        });
        if (quyen) {
            await quyen.destroy();
        }
        return {
            EM: 'Xóa quyền thành công! (Role deleted successfully)',
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

const capNhatQuyen = async (data) => {
    try {
        let quyen = await db.Quyen.findOne({
            where: {id: data.id}
        });
        if (quyen) {
            await quyen.update({
                url: data.url,
                quyenHan: data.quyenHan,
            });
            return {
                EM: 'Cập nhật quyền hạn thành công! (Role updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy quyền hạn. (Role not found)',
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

const layQuyenTheoNhomND = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Không tìm thấy quyền nào. (Not found any roles)',
                EC: 0,
                DT: []
            };
        }

        let cacQuyen = await db.NhomND.findOne({
            where: { id: id },
            attributes: ["id", "tenNhom"],
            include: [
                {
                    model: db.Quyen,
                    attributes: ["id", "url", "quyenHan"],
                    through: { attributes: [] } // Disable attributes from the join table
                }
            ]        
        })

        return {
            EM: 'Lấy quyền theo nhóm thành công! (Get role(s) by group successfully)',
            EC: 0,
            DT: cacQuyen
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

const phanQuyenChoNhomND = async (data) => {
    try {
        await db.NhomQuyen.destroy({
            where: { nhomId: +data.nhomId }
        })
        await db.NhomQuyen.bulkCreate(data.groupRoles);
        return {
            EM: 'Phân quyền cho nhóm thành công! (Assign role(s) to group successfully)',
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
    taoQuyenHan,
    layTatCaQuyen,
    layQuyenTheoTrang,
    xoaQuyenBangId,
    capNhatQuyen,
    layQuyenTheoNhomND,
    phanQuyenChoNhomND
}