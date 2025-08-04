const db = require('../models/index');
const { Op } = require("sequelize");

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

const layThongTinDatPhong = async (roomId) => {
    try {
        const phong = await db.Phong.findOne({
            where: { id: roomId },
            attributes: ['id', 'tenPhong', 'giaThue', 'dienTich', 'sucChua', 'coGacXep'],
            include: [
                {
                    model: db.Nha,
                    attributes: ['id', 'ten', 'diaChi', 'moTa'],
                    include: [
                        {
                            model: db.NguoiDung,
                            attributes: ['hoTen', 'soDienThoai']
                        },
                        {
                            model: db.Xa,
                            attributes: ['tenXa'],
                            include: [
                                {
                                    model: db.Huyen,
                                    attributes: ['tenHuyen']
                                },
                                {
                                    model: db.Tinh,
                                    attributes: ['tenTinh']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!phong) {
            return {
                EM: 'Không tìm thấy phòng.',
                EC: 1,
                DT: null
            };
        }

        const house = phong.Nha;
        delete phong.dataValues.Nha;

        return {
            EM: 'Lấy thông tin đặt phòng thành công!',
            EC: 0,
            DT: {
                phong,
                nha: house
            }
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

const xuLyDatPhong = async ({ roomId, formData, userId }) => {
    try {
        const { hoTen, email, soDienThoai } = formData || {};
        if (!hoTen || !email || !soDienThoai) {
            return {
                EM: 'Thiếu thông tin người đặt phòng. (Missing form data)',
                EC: 1,
                DT: null
            };
        }

        const hopDongHienTai = await db.HopDong.findOne({
            where: {
                sinhVienId: userId,
                ngayKT: null
            }
        });

        if (hopDongHienTai) {
            return {
                EM: 'Bạn đã có hợp đồng còn hiệu lực. Không thể đặt thêm phòng. (Additional bookings are not possible.)',
                EC: 1,
                DT: null
            };
        }
        
        const phong = await db.Phong.findOne({
            where: { id: roomId },
            attributes: ['tenPhong'],
            include: [
                {
                    model: db.Nha,
                    attributes: ['ten', 'chuTroId']
                }
            ]
        });

        if (!phong || !phong.Nha) {
            return {
                EM: 'Không tìm thấy thông tin phòng hoặc nhà. (Room or house not found)',
                EC: 1,
                DT: null
            };
        }

        const daDatPhongNay = await db.LichSu.findOne({
            where: {
                sinhVienId: userId,
                chuTroId: phong.Nha.chuTroId,
                dienGiai: {
                    [Op.like]: `% - phòng "${phong.tenPhong}".%`
                }
            }
        });

        if (daDatPhongNay) {
            return {
                EM: 'Bạn đã từng đặt phòng này trước đây. Không thể đặt lại cùng phòng. (Cannot book the same room twice.)',
                EC: 1,
                DT: null
            };
        }

        const dienGiai = `Đặt phòng tại nhà trọ "${phong.Nha.ten}" - phòng "${phong.tenPhong}". Người đặt: ${hoTen}, Email: ${email}, SĐT: ${soDienThoai}.`;

        await db.LichSu.create({
            chuTroId: phong.Nha.chuTroId,
            sinhVienId: userId,
            dienGiai
        });

        return {
            EM: 'Đặt phòng thành công. (Booking successfully)',
            EC: 0,
            DT: null
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
    layChiTietNha,
    layThongTinDatPhong,
    xuLyDatPhong
}