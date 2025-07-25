const db = require('../models/index');
const axios = require('axios');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const config = require('../config/zalopay.config');

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

module.exports = {
    layThongTinGiayBaoTheoEmail,
    taoThanhToanZaloPay,
    capNhatHoaDonSauKhiThanhToan
}