'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Su_Dung', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      csTrc: {
        type: Sequelize.STRING
      },
      csSau: {
        type: Sequelize.STRING
      },
      ngayGN: {
        type: Sequelize.DATE
      },
      dichVuId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Su_Dung');
  }
};