'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CTHD', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slSuDung: {
        type: Sequelize.STRING
      },
      dgApDung: {
        type: Sequelize.STRING
      },
      thanhTien: {
        type: Sequelize.STRING
      },
      dichVuId: {
        type: Sequelize.INTEGER
      },
      hoaDonId: {
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
    await queryInterface.dropTable('CTHD');
  }
};