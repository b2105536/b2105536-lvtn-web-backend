
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Nguoi_Dung', [
      {
        soDienThoai: '0987654321',
        matKhau: '123456',
        hoTen: 'Cao Quốc Chương',
        email: 'admin@gmail.com',
        soDD: '345276859',
        gioiTinh: 1,
        ngaySinh: '2003-05-30',
        dcThuongTru: 'An Giang',
        anhDD: '',
        loaiQH: 'QUYENHAN',
        tuKhoaQH: 'R1',
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
