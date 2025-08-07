'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Phong_Tai_San', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phongId: {
        type: Sequelize.INTEGER
      },
      taiSanId: {
        type: Sequelize.INTEGER
      },
      soLuong: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      tinhTrang: {
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
    await queryInterface.dropTable('Phong_Tai_San');
  }
};