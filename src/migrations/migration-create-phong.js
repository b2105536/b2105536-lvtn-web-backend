'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Phong', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenPhong: {
        type: Sequelize.STRING
      },
      coGacXep: {
        type: Sequelize.BOOLEAN
      },
      giaThue: {
        type: Sequelize.STRING
      },
      dienTich: {
        type: Sequelize.STRING
      },
      sucChua: {
        type: Sequelize.INTEGER
      },
      ttPhongId: {
        type: Sequelize.STRING
      },
      nhaId: {
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
    await queryInterface.dropTable('Phong');
  }
};