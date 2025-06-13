'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hoa_Don', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ngayTao: {
        type: Sequelize.DATE
      },
      tongTienPhaiTra: {
        type: Sequelize.STRING
      },
      soTienDaTra: {
        type: Sequelize.STRING
      },
      tienDuThangTrc: {
        type: Sequelize.STRING
      },
      ghiChuHD: {
        type: Sequelize.STRING
      },
      hopDongId: {
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
    await queryInterface.dropTable('Hoa_Don');
  }
};