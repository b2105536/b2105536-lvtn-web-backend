'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nguoi_Dung', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soDienThoai: {
        unique: true,
        type: Sequelize.STRING
      },
      matKhau: {
        type: Sequelize.STRING
      },
      hoTen: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      soDD: {
        type: Sequelize.STRING
      },
      gioiTinh: {
        type: Sequelize.BOOLEAN
      },
      ngaySinh: {
        type: Sequelize.DATEONLY
      },
      dcThuongTru: {
        type: Sequelize.STRING
      },
      anhDD: {
        type: Sequelize.STRING
      },
      nhomId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Nguoi_Dung');
  }
};