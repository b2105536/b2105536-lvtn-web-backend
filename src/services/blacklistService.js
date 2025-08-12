const db = require('../models/index');

const themVaoBlacklist = async ({ sinhVienId, lyDo }) => {
    try {
        let sinhVien = await db.NguoiDung.findOne({ where: { id: sinhVienId } });
        if (!sinhVien) {
            return {
                EM: "Không tìm thấy sinh viên! (Student not found)",
                EC: 1,
                DT: null
            };
        }

        let daChan = await db.Blacklist.findOne({ where: { sinhVienId } });
        if (daChan) {
            return {
                EM: "Sinh viên này đã nằm trong danh sách chặn! (Already added)",
                EC: 1,
                DT: daChan
            };
        }

        let newBlacklist = await db.Blacklist.create({
            sinhVienId,
            ngayChan: new Date(),
            lyDo
        });

        return {
            EM: "Đã thêm sinh viên vào danh sách chặn! (Added to blacklist)",
            EC: 0,
            DT: newBlacklist
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Có gì đó không đúng! (Something went wrong in service)",
            EC: 1,
            DT: null
        };
    }
}

const boKhoiBlacklist = async ({ sinhVienId }) => {
    try {
        let record = await db.Blacklist.findOne({ where: { sinhVienId } });
        if (!record) {
            return {
                EM: "Sinh viên này không nằm trong danh sách chặn! (Student not found)",
                EC: 1,
                DT: null
            };
        }

        await db.Blacklist.destroy({ where: { sinhVienId } });

        return {
            EM: "Đã bỏ chặn sinh viên! (Student unblocked successfully)",
            EC: 0,
            DT: null
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Có gì đó không đúng! (Something went wrong in service)",
            EC: 1,
            DT: null
        };
    }
}

module.exports = {
    themVaoBlacklist,
    boKhoiBlacklist
}