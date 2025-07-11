const db = require('../models/index');

const layNhomVoiQuyen = async (user) => {
    let cacQuyen = await db.NhomND.findOne({
        where: { id: user.nhomId },
        attributes: ["id", "tenNhom"],
        include: [
            {
                model: db.Quyen,
                attributes: ["id", "url", "quyenHan"],
                through: { attributes: [] } // Disable attributes from the join table
            }
        ]
    });
    return cacQuyen ? cacQuyen : {};
}

module.exports = {
    layNhomVoiQuyen
}