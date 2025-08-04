const db = require('../models/index');

const layTatCaNha = async () => {
    try {
        let cacNha = await db.Nha.findAll({
            attributes: ["id", "ten", "diaChi", "moTa"],
            include:[
                {
                    model: db.Xa,
                    attributes: ["tenXa"],
                    include: [
                        {
                            model: db.Huyen,
                            attributes: ["tenHuyen"],
                        },
                        {
                            model: db.Tinh,
                            attributes: ["tenTinh"]
                        }
                    ] 
                },
                {
                    model: db.Phong,
                    attributes: ["ttPhongId"]
                },
                {
                    model: db.AnhNha,
                    attributes: ["duongDan"]
                }
            ]
        });

        let nhaWithStatus = cacNha.map((nha) => {
            let soLuongPhongTrong = nha.Phongs.filter((phong) => phong.ttPhongId === '6').length;
            return {
                ...nha.dataValues,
                tinhTrang: soLuongPhongTrong > 0 ? "Còn phòng" : "Hết phòng"
            };
        });

        if (nhaWithStatus) {
            return {
                EM: 'Lấy dữ liệu thành công! (Get data successfully)',
                EC: 0,
                DT: nhaWithStatus
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

const layChiTietNha = async (nhaId) => {
    try {
        const nha = await db.Nha.findOne({
            where: { id: nhaId },
            attributes: ['id', 'ten', 'diaChi', 'moTa'],
            include: [
                {
                    model: db.Xa,
                    attributes: ["tenXa"],
                    include: [
                        {
                            model: db.Huyen,
                            attributes: ["tenHuyen"],
                        },
                        {
                            model: db.Tinh,
                            attributes: ["tenTinh"]
                        }
                    ] 
                },
                {
                    model: db.AnhNha,
                    attributes: ['duongDan']
                },
                {
                    model: db.Phong,
                    attributes: ['id', 'tenPhong', 'coGacXep', 'giaThue', 'dienTich', 'sucChua', 'ttPhongId'],
                    include: [
                        {
                            model: db.BangMa,
                            attributes: ['giaTri'],
                        }
                    ]
                }
            ]
        });

        if (!nha) {
            return {
                EM: 'Không tìm thấy nhà trọ. (House not found)',
                EC: 1,
                DT: null
            };
        }

        return {
            EM: 'Lấy chi tiết nhà trọ thành công! (Get house details successfully)',
            EC: 0,
            DT: nha
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: null
        };
    }
}

module.exports = {
    layTatCaNha,
    layChiTietNha
}