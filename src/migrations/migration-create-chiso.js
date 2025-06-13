'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chi_So', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thang: {
        type: Sequelize.STRING
      },
      csDienTrc: {
        type: Sequelize.STRING
      },
      csDienSau: {
        type: Sequelize.STRING
      },
      csNuocTrc: {
        type: Sequelize.STRING
      },
      csNuocSau: {
        type: Sequelize.STRING
      },
      ngayGN: {
        type: Sequelize.DATE
      },
      phongId: {
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
    await queryInterface.dropTable('Chi_So');
  }
};