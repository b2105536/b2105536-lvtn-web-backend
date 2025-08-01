const db = require('../models/index');
const { Op, fn, col, literal } = require("sequelize");

const laySoLuongNguoiDungTheoNhom = async () => {
    try {
        let dsNhomND = await db.NhomND.findAll();
        let result = [];

        for (let nhom of dsNhomND) {
            let count = await db.NguoiDung.count({ where: { nhomId: nhom.id } });
            result.push({ nhom: nhom.tenNhom, soNguoi: count });
        }

        return {
            EM: 'OK',
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
};

const thongKeSinhVienTheoGioiTinh = async () => {
    try {
        const users = await db.NguoiDung.findAll({
            where: { nhomId: 3 },
            attributes: ['gioiTinh'],
        });

        const counts = users.reduce((acc, user) => {
            let key = 'Khác';

            if (+user.gioiTinh === 1) {
                key = 'Nam';
            } else if (+user.gioiTinh === 0) {
                key = 'Nữ';
            }

            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return {
            EM: 'OK',
            EC: 0,
            DT: counts
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: []
        };
    }
};

const laySoLuongNhaTroTheoHuyen = async () => {
    try {
        let dsHuyen = await db.Huyen.findAll();
        let result = [];

        for (let huyen of dsHuyen) {
            let count = await db.Nha.count({ where: { huyenId: huyen.id } });
            result.push({ huyen: huyen.tenHuyen, soNhaTro: count });
        }

        return {
            EM: 'OK',
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
};

const laySoLuongNhaTroTheoChuSoHuu = async () => {
    try {
        let nguoiDungChuTro = await db.NguoiDung.findAll({
            where: { nhomId: 2 },
            attributes: ["id", "hoTen"]
        });

        let result = [];

        for (let user of nguoiDungChuTro) {
            let count = await db.Nha.count({ where: { chuTroId: user.id } });
            result.push({ chuSoHuu: user.hoTen, soNhaTro: count });
        }

        return {
            EM: 'OK',
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
};

const thongKeDoanhThuTatCaNhaTro = async (filter) => {
    try {
        let { nhaId, type = 'month', fromDate, toDate } = filter;

        let formatKey;
        switch (type) {
            case 'day':
                formatKey = '%Y-%m-%d';
                break;
            case 'week':
                formatKey = '%Y-%u';
                break;
            case 'month':
                formatKey = '%Y-%m';
                break;
            case 'year':
                formatKey = '%Y';
                break;
            default:
                formatKey = '%Y-%m';
        }

        let phongWhere = {};
        if (nhaId) phongWhere.nhaId = nhaId;

        const phongList = await db.Phong.findAll({
            where: phongWhere,
            attributes: ['id']
        });

        const phongIds = phongList.map(p => p.id);
        if (phongIds.length === 0) return {
            EM: 'Không có phòng phù hợp.',
            EC: 0,
            DT: { labels: [], data: [] }
        };

        const hopDongList = await db.HopDong.findAll({
            where: { phongId: phongIds },
            attributes: ['id']
        });

        const hopDongIds = hopDongList.map(hd => hd.id);
        if (hopDongIds.length === 0) return {
            EM: 'Không có hợp đồng phù hợp.',
            EC: 0,
            DT: { labels: [], data: [] }
        };

        let dateCondition = {};
        if (fromDate && toDate) {
            let offsetMs = 7 * 60 * 60 * 1000;
            let fromUTC = new Date(new Date(fromDate).getTime() - offsetMs);
            let toUTC = new Date(new Date(toDate).getTime() - offsetMs);

            dateCondition = {
                ngayTao: {
                    [Op.between]: [fromUTC, toUTC]
                }
            };
        }

        let timeGroupExpr = `DATE_FORMAT(CONVERT_TZ(ngayTao, '+00:00', '+07:00'), '${formatKey}')`;

        const doanhThuList = await db.HoaDon.findAll({
            attributes: [
                [literal(timeGroupExpr), 'thoiGian'],
                [fn('SUM', col('soTienDaTra')), 'tongTien']
            ],
            where: {
                ...dateCondition,
                hopDongId: hopDongIds,
                soTienDaTra: { [Op.gt]: 0 }
            },
            group: [literal(timeGroupExpr)],
            order: [[literal(timeGroupExpr), 'ASC']]
        });

        let rawLabels = doanhThuList.map(item => item.get('thoiGian'));
        let data = doanhThuList.map(item => Number(item.get('tongTien')));

        let labels = [];
        switch (type) {
            case 'day':
                labels = rawLabels.map(label => {
                    let [y, m, d] = label.split('-');
                    return `${d}-${m}-${y}`;
                });
                break;
            case 'week':
                labels = rawLabels.map(label => {
                    let [y, w] = label.split('-');
                    return `T${w}-${y}`;
                });
                break;
            case 'month':
                labels = rawLabels.map(label => {
                    let [y, m] = label.split('-');
                    return `${m}-${y}`;
                });
                break;
            case 'year':
                labels = rawLabels;
                break;
            default:
                labels = rawLabels;
        }

        return {
            EM: 'Thống kê doanh thu thành công. (Get revenue statistics successfully)',
            EC: 0,
            DT: { labels, data }
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: { labels: [], data: [] }
        };
    }
};

module.exports = {
    laySoLuongNguoiDungTheoNhom,
    thongKeSinhVienTheoGioiTinh,
    laySoLuongNhaTroTheoHuyen,
    laySoLuongNhaTroTheoChuSoHuu,
    thongKeDoanhThuTatCaNhaTro
}
