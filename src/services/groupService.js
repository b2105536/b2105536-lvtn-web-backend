const db = require('../models/index');

const layNhomNguoiDung = async () => {
    try {
        let data = await db.NhomND.findAll({
            order: [['tenNhom', 'DESC']]
        });
        return {
            EM: 'Lấy nhóm người dùng thành công! (Get groups successfully)',
            EC: 0,
            DT: data
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: []
        };
    }
}

module.exports = {
    layNhomNguoiDung
}