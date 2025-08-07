module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Hop_Dong', 'tienDatCoc', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 0,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Hop_Dong', 'tienDatCoc');
    }
};