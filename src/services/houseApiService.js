const db = require('../models/index');

const layTatCaNha = async () => {
    try {
        let cacNha = await db.Nha.findAll({
            attributes: ["id", "ten", "diaChi", "moTa"],
            include:[
                { 
                    model: db.NguoiDung, 
                    attributes: ["id", "hoTen"]
                },
                {
                    model: db.Xa,
                    attributes: ["id", "tenXa"],
                    include: [
                        {
                            model: db.Huyen,
                            attributes: ["id", "tenHuyen"],
                        },
                        {
                            model: db.Tinh,
                            attributes: ["id", "tenTinh"]
                        }
                    ] 
                },
                {
                    model: db.AnhNha,
                    attributes: ["duongDan"]
                }
            ]
        });
        if (cacNha) {
            return {
                EM: 'Lấy dữ liệu thành công! (Get data successfully)',
                EC: 0,
                DT: cacNha
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

const layNhaTheoTrang = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Nha.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "ten", "diaChi", "moTa"],
            include:[
                { 
                    model: db.NguoiDung, 
                    attributes: ["id", "hoTen"]
                },
                {
                    model: db.Xa,
                    attributes: ["id", "tenXa"],
                    include: [
                        {
                            model: db.Huyen,
                            attributes: ["id", "tenHuyen"],
                        },
                        {
                            model: db.Tinh,
                            attributes: ["id", "tenTinh"]
                        }
                    ] 
                }
            ],
            order: [['id', 'DESC']]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            houses: rows
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

const taoNha = async (data) => {
    try {
        await db.Nha.create(data);
        return {
            EM: 'Tạo nhà trọ thành công! (House created successfully)',
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

const capNhatTTNha = async (data) => {
    try {
        const requiredFields = {
            ten: 'Vui lòng nhập tên nhà trọ.',
            diaChi: 'Vui lòng nhập địa chỉ.',
            tinhId: 'Vui lòng chọn tỉnh/thành phố.',
            huyenId: 'Vui lòng chọn huyện/quận.',
            xaId: 'Vui lòng chọn xã/phường.',
            chuTroId: 'Vui lòng chọn người đại diện.'
        };

        for (let field in requiredFields) {
            if (!data[field]) {
                return {
                    EM: requiredFields[field],
                    EC: 1,
                    DT: field
                };
            }
        }

        let nhaTro = await db.Nha.findOne({
            where: {id: data.id}
        });
        if (nhaTro) {
            await nhaTro.update({
                ten: data.ten,
                diaChi: data.diaChi,
                moTa: data.moTa,
                chuTroId: data.chuTroId,
                tinhId: data.tinhId,
                huyenId: data.huyenId,
                xaId: data.xaId
            });
            return {
                EM: 'Cập nhật nhà trọ thành công! (House updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy nhà trọ. (House not found)',
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

const xoaNhaBangId = async (nhaId) => {
    try {
        let nhaTro = await db.Nha.findOne({
            where: {id: nhaId}
        });

        if (nhaTro) {
            await nhaTro.destroy();

            return {
                EM: 'Xóa nhà trọ thành công! (House deleted successfully)',
                EC: 0,
                DT: []
            };
        } else {
            return {
                EM: 'Nhà trọ không tồn tại. (House does not exited)',
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

const layNguoiDungChuTro = async () => {
    try {
        let data = await db.NguoiDung.findAll({
            where: {nhomId: 2},
            attributes: ["id", "hoTen"],
            order: [['hoTen', 'ASC']]
        });
        return {
            EM: 'Lấy người dùng chủ trọ thành công! (Get users successfully)',
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

const layTinh = async () => {
    try {
        let data = await db.Tinh.findAll({
            order: [['tenTinh', 'DESC']]
        });
        return {
            EM: 'Lấy tỉnh thành công! (Get provinces successfully)',
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

const layHuyenTheoTinh = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Không tìm thấy huyện nào. (Not found any districts)',
                EC: 0,
                DT: []
            };
        }

        let cacHuyen = await db.Tinh.findOne({
            where: { id: id },
            attributes: ["id", "tenTinh"],
            include: [
                {
                    model: db.Huyen,
                    attributes: ["id", "tenHuyen"]
                }
            ]        
        });

        return {
            EM: 'Lấy huyện theo tỉnh thành công! (Get districts by province successfully)',
            EC: 0,
            DT: cacHuyen
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

const layXaTheoHuyen = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Không tìm thấy xã nào. (Not found any wards)',
                EC: 0,
                DT: []
            };
        }

        let cacXa = await db.Huyen.findOne({
            where: { id: id },
            attributes: ["id", "tenHuyen"],
            include: [
                {
                    model: db.Xa,
                    attributes: ["id", "tenXa"]
                }
            ]        
        });

        return {
            EM: 'Lấy xã theo huyện thành công! (Get wards by district successfully)',
            EC: 0,
            DT: cacXa
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
    layTatCaNha,
    layNhaTheoTrang,
    taoNha,
    capNhatTTNha,
    xoaNhaBangId,
    layNguoiDungChuTro,
    layTinh,
    layHuyenTheoTinh,
    layXaTheoHuyen
}