const db = require('../models/index');

const layThongTinGiayBaoTheoEmail = async (email) => {
    try {
        const sinhVien = await db.NguoiDung.findOne({
            where: { email },
            attributes: ['id', 'hoTen']
        });

        if (!sinhVien) {
            return {
                EC: 1,
                EM: 'Không tìm thấy sinh viên với email này.',
                DT: null
            };
        }

        const sinhVienId = sinhVien.id;

        const hopDong = await db.HopDong.findOne({
            where: {
                sinhVienId,
                ttHopDongId: 8
            },
            order: [['ngayLap', 'DESC']],
            include: [
                {
                    model: db.DichVu,
                    include: [
                        {
                            model: db.GiaDichVu,
                            order: [['thoiDiem', 'DESC']],
                            limit: 1
                        }
                    ]
                },
                {
                    model: db.HoaDon,
                    order: [['ngayTao', 'DESC']],
                    limit: 1
                }
            ]
        });

        if (!hopDong) {
            return {
                EC: 1,
                EM: 'Sinh viên chưa có hợp đồng thuê trọ.',
                DT: null
            };
        }

        const lastUsage = await db.SuDung.findOne({
            where: { hopDongId: hopDong.id },
            order: [['ngayGN', 'DESC']]
        });

        const ngayGN = lastUsage?.ngayGN || new Date();

        const dsDichVu = await Promise.all(
            hopDong.DichVus.map(async (dv) => {
                const lastSD = await db.SuDung.findOne({
                    where: {
                        hopDongId: hopDong.id,
                        dichVuId: dv.id,
                        ngayGN: {
                            [db.Sequelize.Op.lte]: ngayGN
                        }
                    },
                    order: [['ngayGN', 'DESC']]
                });

                return {
                    tenDV: dv.tenDV,
                    donGia: dv.GiaDichVus?.[0]?.donGia || 0,
                    dichVuId: dv.id,
                    csTrcGanNhat: lastSD?.csTrc || 0,
                    csSauGanNhat: lastSD?.csSau || 0
                };
            })
        );

        const hoaDonGanNhat = hopDong.HoaDons?.[0] || null;

        const data = {
            hoTen: sinhVien.hoTen,
            ngayGN,
            giaThue: hopDong.giaThueTrongHD,
            DichVus: dsDichVu,
            hoaDonGanNhat
        };

        return {
            EC: 0,
            EM: 'Lấy giấy báo thành công!',
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
};

module.exports = {
    layThongTinGiayBaoTheoEmail
}