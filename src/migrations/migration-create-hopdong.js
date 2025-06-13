'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hop_Dong', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ngayLap: {
        type: Sequelize.DATE
      },
      noiDung: {
        type: Sequelize.STRING
      },
      chuTroId: {
        type: Sequelize.INTEGER
      },
      sinhVienId: {
        type: Sequelize.INTEGER
      },
      phongId: {
        type: Sequelize.INTEGER
      },
      ngayBD: {
        type: Sequelize.DATE
      },
      ngayKT: {
        type: Sequelize.DATE
      },
      giaThueTrongHD: {
        type: Sequelize.STRING
      },
      ttHopDongId: {
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
    await queryInterface.dropTable('Hop_Dong');
  }
};