
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Huyen', [
      {
        tenHuyen: 'Ninh Kiều',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Bình Thủy',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Cái Răng',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Ô Môn',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Thốt Nốt',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Thới Lai',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Phong Điền',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Vĩnh Thạnh',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenHuyen: 'Cờ Đỏ',
        tinhId: 1,
        ttDVHCId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
