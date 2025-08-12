const db = require('../models/index');

const layDongTienTheoNha = async (houseId) => {
    try {
        const danhSachPhong = await db.Phong.findAll({
            where: { nhaId: houseId },
            attributes: ['id', 'tenPhong'],
            include: [
                {
                    model: db.HopDong,
                    attributes: ['id', 'tienDatCoc'],
                    where: { ttHopDongId: 8 },
                    required: false,
                    include: [
                        {
                            model: db.NguoiDung,
                            attributes: ['hoTen']
                        },
                        {
                            model: db.HoaDon,
                            attributes: ['tongTienPhaiTra', 'soTienDaTra'],
                            required: false,
                        }
                    ]
                }
            ]
        });

        const data = danhSachPhong.map(phong => {
            let hoTen = '';
            let tienNo = 0;
            let tienCoc = 0;
            if (phong.HopDongs && phong.HopDongs.length > 0) {
                const hd = phong.HopDongs[0];
                tienCoc = hd.tienDatCoc || 0;
                if (hd.HoaDons && hd.HoaDons.length > 0) {
                    tienNo = hd.HoaDons.reduce((acc, hd) => acc + (Number(hd.tongTienPhaiTra) - Number(hd.soTienDaTra)), 0);
                }
                if (hd.NguoiDung) {
                    hoTen = hd.NguoiDung.hoTen || '';
                }
            }
            return {
                roomId: phong.id,
                tenPhong: phong.tenPhong,
                hoTen,
                tienNo,
                tienCoc
            };
        });

        return {
            EM: 'Lấy dữ liệu dòng tiền thành công! (Fetched successfully)',
            EC: 0,
            DT: data
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

const hoanTraCoc = async (roomId, tienDatCoc) => {
    try {
        let hopDong = await db.HopDong.findOne({
            where: { phongId: roomId, ttHopDongId: 8 }
        });

        if (!hopDong) {
            return {
                EC: 1,
                EM: "Không tìm thấy hợp đồng cho phòng này. (Contract not found)",
                DT: []
            };
        }

        hopDong.tienDatCoc = tienDatCoc;
        await hopDong.save();

        return {
            EC: 0,
            EM: "Hoàn trả tiền đặt cọc thành công. (Deposit refunded successfully)",
            DT: hopDong
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

const thuTienNo = async (roomId, amount) => {
    try {
        const hopDong = await db.HopDong.findOne({
            where: { phongId: roomId, ttHopDongId: 8 }
        });

        if (!hopDong) {
            return {
                EC: 1,
                EM: "Không tìm thấy hợp đồng cho phòng này. (Contract not found)",
                DT: []
            };
        }

        const hoaDonsNo = await db.HoaDon.findAll({
            where: {
                hopDongId: hopDong.id,
                tienDuThangTrc: { [db.Sequelize.Op.lt]: 0 }
            },
            order: [['ngayTao', 'ASC']]
        });

        const tongNo = hoaDonsNo.reduce((sum, hd) => sum + (Number(hd.tienDuThangTrc) || 0), 0);

        if (tongNo >= 0) {
            return {
                EC: 2,
                EM: "Phòng này không có nợ cần thu. (No debt to collect)",
                DT: []
            };
        }

        if (amount > Math.abs(tongNo)) {
            return {
                EC: 3,
                EM: "Số tiền thu vượt quá số nợ hiện tại. (Amount exceeds current debt)",
                DT: []
            };
        }

        let tienConLai = Number(amount);
        for (const hd of hoaDonsNo) {
            if (tienConLai <= 0) break;

            const noHD = Number(hd.tienDuThangTrc) || 0;

            if (Math.abs(noHD) <= tienConLai) {
                hd.soTienDaTra = (Number(hd.soTienDaTra) || 0) - noHD; 
                hd.tienDuThangTrc = 0;
                tienConLai += noHD;
            } else {
                hd.soTienDaTra = (Number(hd.soTienDaTra) || 0) + tienConLai;
                hd.tienDuThangTrc = noHD + tienConLai;
                tienConLai = 0;
            }

            await hd.save();
        }

        const tienNoSauThu = Number(tongNo) + Number(amount);

        return {
            EC: 0,
            EM: "Thu tiền nợ thành công. (Debt payment successful)",
            DT: {
                hopDongId: hopDong.id,
                tienNoConLai: tienNoSauThu
            }
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Có gì đó không đúng! (Something went wrong)",
            EC: 1,
            DT: []
        };
    }
}

module.exports = {
    layDongTienTheoNha,
    hoanTraCoc,
    thuTienNo
}