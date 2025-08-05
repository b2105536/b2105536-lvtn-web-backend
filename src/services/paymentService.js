const db = require('../models/index');
const axios = require('axios');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const config = require('../config/zalopay.config');
const { Op, fn, col, where } = require('sequelize');

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

const taoThanhToanZaloPay = async (amount, email, hoaDonId) => {
    try {
        const embed_data = {
            email,
            hoaDonId,
            redirecturl: "http://localhost:3000/payment"
        };

        const items = [{}];

        const order = {
            app_id: config.app_id,
            app_user: email,
            app_time: Date.now(),
            amount: amount,
            app_trans_id: moment().format('YYMMDD') + '_' + Math.floor(Math.random() * 1000000),
            embed_data: JSON.stringify(embed_data),
            item: JSON.stringify(items),
            description: `Thanh toán tiền trọ ${email} - ${moment().format('DD/MM/YYYY')}`,
            bank_code: '',
            callback_url: config.callback_url,
            return_url: embed_data.redirecturl
        };

        const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
        const hmac = CryptoJS.HmacSHA256(data, config.key1);
        order.mac = hmac.toString(CryptoJS.enc.Hex);

        const response = await axios.post(config.endpoint, null, { params: order });

        if (response.data.return_code === 1) {
            return {
                EC: 0,
                EM: 'Tạo đơn hàng thành công!',
                DT: response.data
            };
        } else {
            return {
                EC: 1,
                EM: 'Tạo đơn hàng thất bại!',
                DT: response.data
            };
        }
    } catch (error) {
        console.error('ZaloPay order error:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi tạo đơn hàng ZaloPay.',
            DT: null
        };
    }
};

const capNhatHoaDonSauKhiThanhToan = async (hoaDonId, soTienDaTra) => {
    try {
        const hoaDon = await db.HoaDon.findOne({ where: { id: hoaDonId } });

        if (!hoaDon) return false;

        const tienDu = hoaDon.tongTienPhaiTra - soTienDaTra;

        hoaDon.soTienDaTra = soTienDaTra;
        hoaDon.tienDuThangTrc = tienDu;

        await hoaDon.save();

        return true;
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong)',
            EC: 1,
            DT: []
        };
    }
};

const layHoaDonTheoEmail = async (email) => {
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

        const cacHopDong = await db.HopDong.findAll({
            where: { sinhVienId: sinhVien.id },
            attributes: ['id'],
        });

        const hopDongId = cacHopDong.map(hd => hd.id);

        const cacHoaDon = await db.HoaDon.findAll({
            where: { hopDongId: hopDongId },
            include: [
                {
                    model: db.HopDong,
                    include: [
                        {
                            model: db.Phong,
                            attributes: ['tenPhong']
                        },
                        {
                            model: db.NguoiDung,
                            attributes: ['hoTen']
                        }
                    ]
                }
            ],
            order: [['ngayTao', 'DESC']]
        });

        return {
            EC: 0,
            EM: 'Lấy hóa đơn thành công! (Get all invoices successfully)',
            DT: cacHoaDon
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

const layChiTietHoaDon = async (hoaDonId) => {
    try {
        const hoaDon = await db.HoaDon.findOne({
            where: { id: hoaDonId },
            include: [
                {
                    model: db.HopDong,
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
                            model: db.NguoiDung,
                            attributes: ['hoTen']
                        },
                        {
                            model: db.Phong,
                            attributes: ['tenPhong'],
                            include: [
                                {
                                    model: db.Nha,
                                    attributes: ['ten'],
                                    include: [
                                        {
                                            model: db.NguoiDung,
                                            attributes: ['soDienThoai', 'hoTen']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!hoaDon || !hoaDon.HopDong) {
            return { EC: 1, EM: 'Không tìm thấy hóa đơn hoặc hợp đồng.', DT: null };
        }

        const hopDong = hoaDon.HopDong;
        const ngayGN = hoaDon.ngayTao;

        const suDungList = await db.SuDung.findAll({
            where: {
                hopDongId: hopDong.id,
                ngayGN: ngayGN
            }
        });

        const chiTietDichVu = await Promise.all(
            hopDong.DichVus.map(async (dv) => {
                const gia = dv.GiaDichVus?.[0]?.donGia || 0;

                const sd = suDungList.find(item => item.dichVuId === dv.id);

                return {
                    tenDV: dv.tenDV,
                    donGia: gia,
                    dichVuId: dv.id,
                    csTrc: sd?.csTrc || 0,
                    csSau: sd?.csSau || 0
                };
            })
        );

        const result = {
            hoaDonId: hoaDon.id,
            ngayTao: hoaDon.ngayTao,
            tongTienPhaiTra: hoaDon.tongTienPhaiTra,
            soTienDaTra: hoaDon.soTienDaTra,
            tienDuThangTrc: hoaDon.tienDuThangTrc,
            ghiChuHD: hoaDon.ghiChuHD,
            ten: hopDong.Phong.Nha.ten,
            soDienThoai: hopDong.Phong.Nha.NguoiDung.soDienThoai,
            tenPhong: hopDong.Phong.tenPhong,
            giaThue: hopDong.giaThueTrongHD,
            hoTen: hopDong.NguoiDung.hoTen,
            DichVus: chiTietDichVu
        };

        return {
            EC: 0,
            EM: 'Lấy chi tiết hóa đơn thành công! (Get invoice details successfully)',
            DT: result
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

const layDanhSachDatPhongTheoEmail = async (email) => {
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

        const lichSuDatPhong = await db.LichSu.findAll({
            where: {
                sinhVienId: sinhVien.id,
                [Op.and]: [
                    where(fn('LOWER', col('dienGiai')), {
                        [Op.notLike]: '%done%'
                    })
                ]
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'dienGiai', 'createdAt']
        });

        const regexTenNha = /nhà trọ\s+"([^"]+)"/i;
        const regexTenPhong = /phòng\s+"([^"]+)"/i;

        const results = lichSuDatPhong.map(item => {
            const matchNha = item.dienGiai.match(regexTenNha);
            const matchPhong = item.dienGiai.match(regexTenPhong);

            return {
                id: item.id,
                createdAt: item.createdAt,
                dienGiai: item.dienGiai,
                tenNha: matchNha ? matchNha[1] : null,
                tenPhong: matchPhong ? matchPhong[1] : null
            };
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách đặt phòng thành công! (Get booking list successfully)',
            DT: results
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
    layThongTinGiayBaoTheoEmail,
    taoThanhToanZaloPay,
    capNhatHoaDonSauKhiThanhToan,
    layHoaDonTheoEmail,
    layChiTietHoaDon,
    layDanhSachDatPhongTheoEmail
}