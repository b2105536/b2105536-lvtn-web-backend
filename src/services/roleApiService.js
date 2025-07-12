const db = require('../models/index');

const taoQuyenHan = async (roles) => {
    try {
        let quyenHienThoi = await db.Quyen.findAll({
            attributes: ['url', 'quyenHan'],
            raw: true
        });

        const persists = roles.filter(({ url: url1 }) =>
            !quyenHienThoi.some(({ url: url2 }) => url1 === url2)
        );
        
        if (persists.length === 0) {
            return {
                EM: 'Không có quyền để tạo. (Nothing to create)',
                EC: 0,
                DT: []
            };
        }
        await db.Quyen.bulkCreate(persists);
        return {
                EM: `Tạo ${persists.length} quyền thành công! (Role(s) created successfully)`,
                EC: 0,
                DT: []
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
    taoQuyenHan
}