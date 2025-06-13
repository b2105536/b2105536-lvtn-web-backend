'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dat_Lich', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ttDatLichId: {
        type: Sequelize.STRING
      },
      chuTroId: {
        type: Sequelize.INTEGER
      },
      sinhVienId: {
        type: Sequelize.INTEGER
      },
      ngayDat: {
        type: Sequelize.DATE
      },
      loaiTG: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Dat_Lich');
  }
};