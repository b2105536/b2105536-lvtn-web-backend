const db = require('../models/index');

// Khách thuê
const layTatCaNhaTheoChuSoHuu = async (email) => {
    try {
        let nguoiDung = await db.NguoiDung.findOne({
            where: { email },
            attributes: ['id', 'hoTen']
        });

        if (!nguoiDung) {
            return {
                EM: 'Không tìm thấy người dùng. (User not found)',
                EC: 1,
                DT: []
            };
        }

        let danhSachNha = await db.Nha.findAll({
            where: { chuTroId: nguoiDung.id },
            attributes: ['id', 'ten'],
            order: [['id', 'DESC']]
        });

        return {
            EM: 'Lấy danh sách nhà thành công! (Fetched successfully)',
            EC: 0,
            DT: danhSachNha
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

const layPhongTheoNha = async (nhaId) => {
    try {
        if (!nhaId) {
            return {
                EM: 'Thiếu nhaId (Missing nhaId)',
                EC: 1,
                DT: []
            };
        }

        const danhSachPhong = await db.Phong.findAll({
            where: { nhaId: nhaId },
            attributes: ['id', 'tenPhong', 'coGacXep', 'giaThue', 'dienTich', 'sucChua', 'ttPhongId', 'nhaId'],
            order: [['tenPhong', 'ASC']],
            include: [
                {
                    model: db.HopDong,
                    where: { ngayKT: null },
                    required: false,
                    include: [
                        {
                            model: db.NguoiDung,
                            attributes: ['id', 'hoTen']
                        }
                    ]
                }
            ]
        });

        const phongCoTrangThai = danhSachPhong.map(phong => {
            const hopDong = phong.HopDongs?.[0];
            const sinhVien = hopDong?.NguoiDung;

            return {
                ...phong.toJSON(),
                daChoThue: !!hopDong,
                hopDongId: hopDong?.id || null,
                sinhVienThue: sinhVien ? { id: sinhVien.id, hoTen: sinhVien.hoTen } : null
            };
        });

        return {
            EM: 'Lấy danh sách phòng thành công! (Fetched successfully)',
            EC: 0,
            DT: phongCoTrangThai
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

const taoHoacThemHopDongKhach = async (data) => {
    try {
        const chuTro = await db.NguoiDung.findOne({
            where: { email: data.emailChuTro }
        });
        if (!chuTro) {
            return {
                EM: 'Không tìm thấy chủ trọ!',
                EC: 1,
                DT: null
            };
        }

        let nguoiDung = await db.NguoiDung.findOne({
            where: {
                email: data.email,
                soDienThoai: data.soDienThoai
            },
            attributes: ['id', 'email', 'soDienThoai', 'nhomId']
        });
        if (!nguoiDung) {
            return {
                EM: 'Người dùng không tồn tại trong hệ thống.',
                EC: 1,
                DT: null
            };
        }
        if (nguoiDung.nhomId !== 3) {
            return {
                EM: 'Chỉ người dùng thuộc nhóm sinh viên mới được thêm!',
                EC: 1,
                DT: null
            };
        }

        const daCoHopDong = await db.HopDong.findOne({
            where: {
                sinhVienId: nguoiDung.id,
                ngayKT: null
            }
        });
        if (daCoHopDong) {
            return {
                EM: 'Người dùng đã có hợp đồng ở phòng khác.',
                EC: 1,
                DT: null
            };
        }

        const tonTai = await db.HopDong.findOne({
            where: {
                sinhVienId: nguoiDung.id,
                phongId: data.phongId
            }
        });
        if (tonTai) {
            return {
                EM: 'Khách này đã được thêm vào phòng này.',
                EC: 1,
                DT: null
            };
        }

        const newHopDong = await db.HopDong.create({
            ngayLap: new Date(),
            phongId: data.phongId,
            sinhVienId: nguoiDung.id,
            ngayBD: new Date(),
            chuTroId: chuTro.id,
            giaThueTrongHD: data.giaThue,
            ttHopDongId: 8
        });

        await db.Phong.update(
            { ttPhongId: 5 },
            { where: { id: data.phongId } }
        );

        return {
            EM: 'Thêm khách vào phòng thành công!',
            EC: 0,
            DT: newHopDong
        };
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: null
        };
    }
};

const xoaHopDongBangId = async (hopDongId, phongId) => {
    try {
        let hopDong = await db.HopDong.findOne({
            where: {id: hopDongId}
        });

        if (!hopDong) {
            return {
                EM: 'Hợp đồng không tồn tại!',
                EC: 1,
                DT: null
            };
        }

        
        await db.HopDong.destroy({ where: { id: hopDongId } });

        await db.Phong.update(
            { ttPhongId: 6 },
            { where: { id: phongId } }
        );

        return {
            EM: 'Xóa hợp đồng thành công! (Contract deleted successfully)',
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

// Dịch vụ:
const taoDichVu = async (services) => {
    try {
        let dvHienThoi = await db.DichVu.findAll({
            attributes: ['tenDV', 'donViTinh', 'ghiChuDV'],
            raw: true
        });

        const persists = services.filter(({ tenDV: tenDV1 }) =>
            !dvHienThoi.some(({ tenDV: tenDV2 }) => tenDV1 === tenDV2)
        );
        
        if (persists.length === 0) {
            return {
                EM: 'Không có dịch vụ để tạo. (Nothing to create)',
                EC: 0,
                DT: []
            };
        }
        const dichVuDaTao = await db.DichVu.bulkCreate(persists, { returning: true });

        const duLieuVeGia = [];
        const bayGio = new Date();

        const donGiaMap = new Map();
        persists.forEach(dv => {
            donGiaMap.set(dv.tenDV, dv.donGia || 0);
        });
        
        dichVuDaTao.forEach(dv => {
            duLieuVeGia.push({
                donGia: donGiaMap.get(dv.tenDV),
                thoiDiem: bayGio,
                dichVuId: dv.id
            });
        });

        await db.GiaDichVu.bulkCreate(duLieuVeGia);

        return {
                EM: `Tạo ${dichVuDaTao.length} dịch vụ thành công! (Service(s) created successfully)`,
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

const layTatCaDichVu = async () => {
    try {
        let data = await db.DichVu.findAll({
            include: [
                {
                    model: db.GiaDichVu,
                    attributes: ['donGia', 'thoiDiem'],
                    limit: 1,
                    order: [['thoiDiem', 'DESC']]
                }
            ],
            order: [['id', 'DESC']]
        });
        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
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

const layDichVuTheoTrang = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.DichVu.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "tenDV", "donViTinh", "ghiChuDV"],
            include: [
                {
                    model: db.GiaDichVu,
                    attributes: ['donGia', 'thoiDiem'],
                    limit: 1,
                    order: [['thoiDiem', 'DESC']]
                }
            ],
            order: [['id', 'DESC']]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            services: rows
        };
        return {
            EM: 'Ok! (Fetch ok)',
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

const xoaDichVuBangId = async (id) => {
    try {
        let dichVu = await db.DichVu.findOne({
            where: {id: id},
            include: {
                model: db.GiaDichVu,
            }
        });

        if (dichVu) {
            if (dichVu.GiaDichVus && dichVu.GiaDichVus.length > 0) {
                await db.GiaDichVu.destroy({
                    where: { dichVuId: id }
                });
            }

            await dichVu.destroy();

            return {
                EM: 'Xóa dịch vụ thành công! (Service deleted successfully)',
                EC: 0,
                DT: []
            };
        }
        
        return {
            EM: 'Không tìm thấy dịch vụ. (Service not found)',
            EC: 1,
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

const capNhatDichVu = async (data) => {
    try {
        let dichVu = await db.DichVu.findOne({
            where: {id: data.id}
        });
        if (dichVu) {
            await dichVu.update({
                tenDV: data.tenDV,
                donViTinh: data.donViTinh,
                ghiChuDV: data.ghiChuDV,
            });

            if (data.donGia) {
                await db.GiaDichVu.create({
                    donGia: data.donGia,
                    thoiDiem: new Date(),
                    dichVuId: data.id
                });
            }
            return {
                EM: 'Cập nhật dịch vụ thành công! (Service updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy dịch vụ. (Service not found)',
                EC: 2,
                DT: ''
            };
        }
    } catch (e) {
        console.log(e);
        return {
            EM: 'Có gì đó không đúng! (Something went wrong in service)',
            EC: 1,
            DT: []
        };
    }
}

// Sử dụng:
const layTatCaHopDong = async () => {
    try {
        let data = await db.HopDong.findAll({
            // attributes: ["id", "ngayLap", "chuTroId", "sinhVienId", "phongId"],
            include: [
                {
                    model: db.NguoiDung,
                    attributes: ["id", "hoTen"]
                },
                {
                    model: db.Phong,
                    attributes: ["id", "tenPhong"],
                }
            ],
            order: [['id', 'DESC']]
        });
        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
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

const layDichVuTheoHopDong = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Không tìm thấy dịch vụ nào. (Not found any services)',
                EC: 0,
                DT: []
            };
        }

        let cacDV = await db.HopDong.findOne({
            where: { id: id },
            // attributes: ["id", "tenNhom"],
            include: [
                {
                    model: db.DichVu,
                    attributes: ["id", "tenDV", "donViTinh", "ghiChuDV"],
                    through: { attributes: [] } // Disable attributes from the join table
                }
            ]        
        })

        return {
            EM: 'Lấy dịch vụ theo hợp đồng thành công! (Get service(s) by contract successfully)',
            EC: 0,
            DT: cacDV
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

const ganDichVuChoHopDong = async (data) => {
    try {
        await db.SuDung.destroy({
            where: { hopDongId: +data.hopDongId }
        })
        await db.SuDung.bulkCreate(data.contractServices);
        return {
            EM: 'Gán dịch vụ cho hợp đồng thành công! (Assign service(s) to contract successfully)',
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

const layGiaHienTai = async (dichVuId) => {
    const gia = await db.GiaDichVu.findOne({
        where: { dichVuId },
        order: [['thoiDiem', 'DESC']],
    });

    return Number(gia?.donGia) || 0;
};

const taoHoaDon = async (data) => {
    try {
        const { hopDongId, ngayGN, dien, nuoc, dichVuKhac } = data;

        if (!hopDongId || !ngayGN) {
            return {
                EM: 'Thiếu dữ liệu!',
                EC: 1,
                DT: []
            };
        }

        let tongTien = 0;
        const suDung = [];

        if (dien && dien.dichVuId) {
            const giaDien = await layGiaHienTai(dien.dichVuId);
            const soLuong = dien.csSau - dien.csTrc;
            const tien = soLuong * Number(giaDien);
            tongTien += tien;

            suDung.push({
                hopDongId,
                dichVuId: dien.dichVuId,
                csTrc: dien.csTrc,
                csSau: dien.csSau,
                ngayGN
            });
        }

        if (nuoc && nuoc.dichVuId) {
            const giaNuoc = await layGiaHienTai(nuoc.dichVuId);
            const soLuong = nuoc.csSau - nuoc.csTrc;
            const tien = soLuong * Number(giaNuoc);

            tongTien += tien;

            suDung.push({
                hopDongId,
                dichVuId: nuoc.dichVuId,
                csTrc: nuoc.csTrc,
                csSau: nuoc.csSau,
                ngayGN
            });
        }

        if (dichVuKhac && dichVuKhac.length > 0) {
            for (let dv of dichVuKhac) {
                if (!dv.dichVuId) continue;
                const gia = await layGiaHienTai(dv.dichVuId);

                tongTien += Number(gia);

                suDung.push({
                    hopDongId,
                    dichVuId: dv.dichVuId,
                    csTrc: 0,
                    csSau: 0,
                    ngayGN
                });
            }
        }

        await db.SuDung.bulkCreate(suDung);

        const hopDong = await db.HopDong.findOne({
            where: { id: hopDongId }
        });
        const giaThue = Number(hopDong?.giaThueTrongHD) || 0;
        tongTien += giaThue;

        const hoaDon = await db.HoaDon.create({
            hopDongId,
            ngayTao: ngayGN,
            tongTienPhaiTra: tongTien,
            soTienDaTra: 0,
            tienDuThangTrc: 0,
            ghiChuHD: null
        })

        return {
            EM: 'Tạo hóa đơn thành công! (Invoice created successfully)',
            EC: 0,
            DT: { id: hoaDon.id }
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

const layThongTinHoaDon = async (hopDongId) => {
    try {
        const hopDong = await db.HopDong.findOne({
            where: { id: hopDongId },
            include: [
                {
                    model: db.NguoiDung,
                    attributes: ['hoTen']
                },
                {
                    model: db.DichVu,
                    include: [
                        {
                            model: db.GiaDichVu,
                            order: [['thoiDiem', 'DESC']],
                            limit: 1
                        }
                    ]
                }
            ]
        });

        if (!hopDong) return { EC: 1, EM: 'Không tìm thấy hợp đồng' };

        const ngayGN = new Date();

        const dsDichVu = await Promise.all(
            hopDong.DichVus.map(async (dv) => {
                const lastSD = await db.SuDung.findOne({
                    where: {
                        hopDongId,
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
                    csTrcGanNhat: lastSD?.csSau || 0
                };
            })
        );

        const data = {
            hoTen: hopDong.NguoiDung?.hoTen || 'Không rõ',
            ngayGN,
            giaThue: hopDong.giaThueTrongHD || 0,
            DichVus: dsDichVu
        };

        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
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

const layThongTinGiayBao = async (hopDongId) => {
    try {
        const hopDong = await db.HopDong.findOne({
            where: { id: hopDongId },
            include: [
                {
                    model: db.NguoiDung,
                    attributes: ['hoTen']
                },
                {
                    model: db.DichVu,
                    include: [
                        {
                            model: db.GiaDichVu,
                            order: [['thoiDiem', 'DESC']],
                            limit: 1
                        }
                    ]
                }
            ]
        });

        if (!hopDong) return { EC: 1, EM: 'Không tìm thấy hợp đồng' };

        const lastUsage = await db.SuDung.findOne({
            where: { hopDongId },
            order: [['ngayGN', 'DESC']]
        });

        const ngayGN = lastUsage?.ngayGN || new Date();
        // const ngayGN = new Date();

        const dsDichVu = await Promise.all(
            hopDong.DichVus.map(async (dv) => {
                const lastSD = await db.SuDung.findOne({
                    where: {
                        hopDongId,
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

        const data = {
            hoTen: hopDong.NguoiDung?.hoTen || 'Không rõ',
            ngayGN,
            giaThue: hopDong.giaThueTrongHD || 0,
            DichVus: dsDichVu
        };

        return {
            EM: 'Lấy dữ liệu thành công! (Get data successfully)',
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

const layHoaDonTheoHopDong = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Không tìm thấy hóa đơn nào. (Not found any invoices)',
                EC: 0,
                DT: []
            };
        }

        let hopDong = await db.HopDong.findOne({
            where: { id: id },
            // attributes: ["id", "tenNhom"],
            include: [
                {
                    model: db.NguoiDung,
                    attributes: ["id", "hoTen"]
                }
            ]        
        });

        if (!hopDong) {
            return {
                EM: 'Không tìm thấy hợp đồng. (Contract not found)',
                EC: 1,
                DT: null
            };
        }

        let hoaDonChuaTT = await db.HoaDon.findOne({
            where: {
                hopDongId: id,
                [db.Sequelize.Op.or]: [
                    db.sequelize.where(
                        db.sequelize.cast(db.sequelize.col('soTienDaTra'), 'DECIMAL'),
                        '<',
                        db.sequelize.col('tongTienPhaiTra')
                    ),
                    {
                        soTienDaTra: null
                    }
                ]
            },
            order: [['ngayTao', 'DESC']]
        });

        console.log(hoaDonChuaTT)

        return {
            EM: 'Lấy hóa đơn theo hợp đồng thành công! (Get invoice(s) by contract successfully)',
            EC: 0,
            DT: {
                NguoiDung: hopDong.NguoiDung,
                hoaDon: hoaDonChuaTT
            }
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

const capNhatHoaDon = async (data) => {
    try {
        const { id, soTienDaTra, tienDuThangTrc, ghiChuHD } = data;
        
        let hoaDon = await db.HoaDon.findOne({ where: { id } });
        if (hoaDon) {
            await hoaDon.update({
                soTienDaTra,
                tienDuThangTrc,
                ghiChuHD,
            });

            return {
                EM: 'Cập nhật hóa đơn thành công! (Invoice updated successfully)',
                EC: 0,
                DT: ''
            };
        } else {
            return {
                EM: 'Không tìm thấy hóa đơn. (Invoice not found)',
                EC: 2,
                DT: ''
            };
        }
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
    layTatCaNhaTheoChuSoHuu,
    layPhongTheoNha,
    taoHoacThemHopDongKhach,
    xoaHopDongBangId,
    taoDichVu,
    layTatCaDichVu,
    layDichVuTheoTrang,
    xoaDichVuBangId,
    capNhatDichVu,
    layTatCaHopDong,
    layDichVuTheoHopDong,
    ganDichVuChoHopDong,
    taoHoaDon,
    layThongTinHoaDon,
    layThongTinGiayBao,
    layHoaDonTheoHopDong,
    capNhatHoaDon
}