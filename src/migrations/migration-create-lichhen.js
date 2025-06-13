'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lich_Hen', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slLichHen: {
        type: Sequelize.INTEGER
      },
      slToiDa: {
        type: Sequelize.INTEGER
      },
      ngayHen: {
        type: Sequelize.DATE
      },
      loaiTG: {
        type: Sequelize.STRING
      },
      chuTroId: {
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
    await queryInterface.dropTable('Lich_Hen');
  }
};