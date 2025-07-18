const db = require('../models/index');

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

module.exports = {
    laySoLuongNguoiDungTheoNhom,
    thongKeSinhVienTheoGioiTinh,
    laySoLuongNhaTroTheoHuyen,
    laySoLuongNhaTroTheoChuSoHuu
}
