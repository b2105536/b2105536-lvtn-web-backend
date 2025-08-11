const manageApiService = require('../services/manageApiService');

// Khách thuê
const getHousesByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                EM: 'Thiếu email. (Missing email)',
                EC: 1,
                DT: []
            });
        }

        let data = await manageApiService.layTatCaNhaTheoChuSoHuu(email);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const getRoomsByHouse = async (req, res) => {
    try {
        const { nhaId } = req.query;

        let data = await manageApiService.layPhongTheoNha(nhaId);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const createFunc = async (req, res) => {
    try {
        const data = req.body;

        if (!data.hoTen || !data.soDienThoai || !data.email || !data.phongId) {
            return res.status(400).json({
                EM: 'Thiếu thông tin bắt buộc! (Missing required parameters)',
                EC: 1,
                DT: null
            });
        }

        const result = await manageApiService.taoHoacThemHopDongKhach(data);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const deleteFunc = async (req, res) => {
    try {
        const { hopDongId, phongId } = req.body;

        if (!hopDongId || !phongId) {
            return res.status(400).json({
                EM: 'Thiếu thông tin hợp đồng hoặc phòng. (Missing information)',
                EC: 1,
                DT: null
            });
        }

        let data = await manageApiService.ketThucHopDong(hopDongId, phongId);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

// Dịch vụ:
const serviceCreateFunc = async (req, res) => {
    try {
        let data = await manageApiService.taoDichVu(req.body);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const serviceReadFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await manageApiService.layDichVuTheoTrang(+page, +limit);
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        } else {
            let data = await manageApiService.layTatCaDichVu();
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const serviceDeleteFunc = async (req, res) => {
    try {
        let data = await manageApiService.xoaDichVuBangId(req.body.id);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const serviceUpdateFunc = async (req, res) => {
    try {
        let data = await manageApiService.capNhatDichVu(req.body);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

// Sử dụng:
const contractReadFunc = async (req, res) => {
    try {
            let data = await manageApiService.layTatCaHopDong();
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // data (trả về data nên service cũng trả về data)
            });
        }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const getServiceByContract = async (req, res) => {
    try {
        let id = req.params.hopDongId;
        let data = await manageApiService.layDichVuTheoHopDong(id);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const assignServiceToContract = async (req, res) => {
    try {
        let data = await manageApiService.ganDichVuChoHopDong(req.body.data);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

// Giấy báo
const createInvoice = async (req, res) => {
    try {
        let data = await manageApiService.taoHoaDon(req.body.data);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const getInvoiceInfo = async (req, res) => {
    try {
        const hopDongId = req.params.hopDongId;
        if (!hopDongId) {
            return res.status(200).json({
                EM: 'Missing required parameter', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }
        
        let data = await manageApiService.layThongTinHoaDon(hopDongId);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const getShowInvoiceInfo = async (req, res) => {
    try {
        const hopDongId = req.params.hopDongId;
        if (!hopDongId) {
            return res.status(200).json({
                EM: 'Missing required parameter', // error message
                EC: '1', // error code
                DT: '' // data
            })
        }
        
        let data = await manageApiService.layThongTinGiayBao(hopDongId);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const getInvoiceByContract = async (req, res) => {
    try {
        let id = req.params.hopDongId;
        let data = await manageApiService.layHoaDonTheoHopDong(id);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

const updateInvoice = async (req, res) => {
    try {
        let data = await manageApiService.capNhatHoaDon(req.body.data);
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // data (trả về data nên service cũng trả về data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // data
        });
    }
}

// Doanh thu:
const getListInvoices = async (req, res) => {
    try {
        let houseId = req.query.houseId;

        if (!houseId) {
            return res.status(400).json({
                EM: 'Thiếu mã nhà trọ.',
                EC: 1,
                DT: ''
            });
        }

        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await manageApiService.layDSHoaDonTheoTrang(houseId, +page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } else {
            const data = await manageApiService.layDSHoaDonTheoNha(houseId);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getRevenueChart = async (req, res) => {
    try {
        const { houseId, type } = req.query;

        if (!houseId || !type) {
            return res.status(400).json({
                EM: 'Missing required params.',
                EC: 1,
                DT: ''
            });
        }

        const data = await manageApiService.layDoanhThuTheoThoiGian(houseId, type);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

// Phòng:
const updateRoomNamePrice = async (req, res) => {
    try {
        const result = await manageApiService.capNhatTenGiaPhong(req.body);
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getStudentInfo = async (req, res) => {
    try {
        const { phongId } = req.query;

        let data = await manageApiService.layThongTinSinhVien(phongId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getAssetOfRoom = async (req, res) => {
    try {
        let id = req.params.phongId;
        let data = await manageApiService.layTaiSanCuaPhong(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const updateRoomAssets = async (req, res) => {
    try {
        const roomId = req.params.phongId;
        const assets = req.body.assets;

        if (!roomId || !Array.isArray(assets)) {
            return res.status(400).json({
                EM: 'Thiếu dữ liệu đầu vào (Missing required inputs)',
                EC: 1,
                DT: ''
            });
        }

        const result = await manageApiService.luuTaiSanCuaPhong(roomId, assets);

        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getRoomHistory = async (req, res) => {
    try {
        const { phongId } = req.query;

        let data = await manageApiService.layLichSuThuePhong(phongId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

// Nhà:
const updateHouseNameDescription = async (req, res) => {
    try {
        let data = await manageApiService.capNhatTenVaMoTaNha(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getImagesByHouse = async (req, res) => {
    try {
        const houseId = req.params.houseId;
        let data = await manageApiService.layAnhNhaTheoNha(houseId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

// Đặt phòng:
const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({
                EM: 'Thiếu mã phòng. (Missing roomId)',
                EC: 1,
                DT: null
            });
        }

        const result = await manageApiService.layDanhSachDatPhongTheoPhong(roomId);

        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const getBookingCount = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({
                EM: 'Thiếu mã phòng. (Missing roomId)',
                EC: 1,
                DT: null
            });
        }

        const result = await manageApiService.demSoDatPhong(roomId);
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

// Tài sản:
const assetCreateFunc = async (req, res) => {
    try {
        let data = await manageApiService.taoTaiSan(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const assetReadFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await manageApiService.layTaiSanTheoTrang(+page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } else {
            let data = await manageApiService.layTatCaTaiSan();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const assetDeleteFunc = async (req, res) => {
    try {
        let data = await manageApiService.xoaTaiSanBangId(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

const assetUpdateFunc = async (req, res) => {
    try {
        let data = await manageApiService.capNhatTaiSan(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        });
    }
}

module.exports = {
    getHousesByEmail,
    getRoomsByHouse,
    createFunc,
    deleteFunc,
    serviceCreateFunc,
    serviceReadFunc,
    serviceDeleteFunc,
    serviceUpdateFunc,
    contractReadFunc,
    getServiceByContract,
    assignServiceToContract,
    createInvoice,
    getInvoiceInfo,
    getShowInvoiceInfo,
    getInvoiceByContract,
    updateInvoice,
    getListInvoices,
    getRevenueChart,
    updateRoomNamePrice,
    getStudentInfo,
    updateHouseNameDescription,
    getImagesByHouse,
    getBookingsByRoom,
    getBookingCount,
    assetCreateFunc,
    assetReadFunc,
    assetDeleteFunc,
    assetUpdateFunc,
    getAssetOfRoom,
    updateRoomAssets,
    getRoomHistory
}