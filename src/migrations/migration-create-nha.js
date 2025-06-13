'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nha', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten: {
        type: Sequelize.STRING
      },
      diaChi: {
        type: Sequelize.STRING
      },
      moTa: {
        type: Sequelize.TEXT
      },
      chuTroId: {
        type: Sequelize.INTEGER
      },
      tinhId: {
        type: Sequelize.INTEGER
      },
      huyenId: {
        type: Sequelize.INTEGER
      },
      xaId: {
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
    await queryInterface.dropTable('Nha');
  }
};