const db = require('../models/index');

const layHopDongTheoId = async (id) => {
    try {
        let data = await db.HopDong.findOne({
            where: { id: id },
            include: [
                {
                    model: db.NguoiDung,
                    attributes: ["id", "hoTen", "gioiTinh", "soDD", "soDienThoai"]
                },
                {
                    model: db.Phong,
                    attributes: ["id", "tenPhong"],
                    include: [
                        {
                            model: db.Nha,
                            attributes: ["ten", "diaChi"],
                            include: [
                                {
                                    model: db.Xa,
                                    attributes: ["tenXa"],
                                    include: [
                                        {
                                            model: db.Huyen,
                                            attributes: ["tenHuyen"]
                                        },
                                        {
                                            model: db.Tinh,
                                            attributes: ["tenTinh"]
                                        }
                                    ]
                                },
                                {
                                    model: db.NguoiDung,
                                    attributes: ["hoTen", "soDienThoai"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!data) {
            return {
                EM: 'Không tìm thấy hợp đồng! (Contract not found)',
                EC: 1,
                DT: null
            };
        }

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
            DT: null
        };
    }
}

const capNhatHopDong = async (id, { ngayKT, tienDatCoc }) => {
    try {
        let hopDong = await db.HopDong.findOne({ where: { id } });
        if (!hopDong) {
            return {
                EM: 'Không tìm thấy hợp đồng để cập nhật! (Contract not found)',
                EC: 1,
                DT: null
            };
        }

        if (hopDong.noiDung === 'Đã lập') {
            return { EM: 'Hợp đồng này đã được lập!', EC: 1, DT: null };
        }

        hopDong.ngayKT = ngayKT;
        hopDong.tienDatCoc = tienDatCoc;
        hopDong.noiDung = "Đã lập";

        await hopDong.save();

        return {
            EM: 'Cập nhật hợp đồng thành công! (Contract updated successfully)',
            EC: 0,
            DT: hopDong
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

const giaHanHopDong = async (id, { soThangGiaHan }) => {
    try {
        let hopDong = await db.HopDong.findOne({ where: { id } });
        if (!hopDong) {
            return {
                EM: 'Không tìm thấy hợp đồng để gia hạn! (Contract not found)',
                EC: 1,
                DT: null
            };
        }

        if (!soThangGiaHan || Number(soThangGiaHan) <= 0) {
            return {
                EM: 'Số tháng gia hạn không hợp lệ! (Invalid extension months)',
                EC: 1,
                DT: null
            };
        }

        let ngayKT = new Date(hopDong.ngayKT);
        let ngayHienTai = new Date();
        let chenhLechThang =
            (ngayKT.getFullYear() - ngayHienTai.getFullYear()) * 12 +
            (ngayKT.getMonth() - ngayHienTai.getMonth());

        if (chenhLechThang > 1 || (chenhLechThang === 1 && ngayKT.getDate() > ngayHienTai.getDate())) {
            return {
                EM: 'Hợp đồng còn thời hạn trên 1 tháng, chưa thể gia hạn!',
                EC: 1,
                DT: null
            };
        }

        ngayKT.setMonth(ngayKT.getMonth() + Number(soThangGiaHan));

        hopDong.ngayKT = ngayKT;
        await hopDong.save();

        return {
            EM: 'Gia hạn hợp đồng thành công! (Contract extended successfully)',
            EC: 0,
            DT: hopDong
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
    layHopDongTheoId,
    capNhatHopDong,
    giaHanHopDong
}