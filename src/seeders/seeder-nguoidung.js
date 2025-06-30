
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Nguoi_Dung', [
      {
        soDienThoai: '0987654321',
        matKhau: 'admin',
        hoTen: 'Cao Quốc Chương',
        email: 'admin@gmail.com',
        soDD: '345276859',
        gioiTinh: 1,
        ngaySinh: '2003-05-30',
        dcThuongTru: 'An Giang',
        anhDD: '',
        nhomId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soDienThoai: '0123456789',
        matKhau: '123456',
        hoTen: 'Nguyễn Văn Sơn',
        email: 'aaaa@gmail.com',
        soDD: '345283405',
        gioiTinh: 1,
        ngaySinh: '2002-06-23',
        dcThuongTru: 'Vĩnh Long',
        anhDD: '',
        nhomId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soDienThoai: '0987112370',
        matKhau: '123456',
        hoTen: 'Trần Trung Hiếu',
        email: 'hieutran123@gmail.com',
        soDD: '345334745',
        gioiTinh: 1,
        ngaySinh: '1976-01-12',
        dcThuongTru: 'TP. Cần Thơ',
        anhDD: '',
        nhomId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soDienThoai: '0983231234',
        matKhau: '123456',
        hoTen: 'Phùng Hiệp',
        email: 'hiep112@gmail.com',
        soDD: '345111678',
        gioiTinh: 1,
        ngaySinh: '2005-06-30',
        dcThuongTru: 'Tây Ninh',
        anhDD: '',
        nhomId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
