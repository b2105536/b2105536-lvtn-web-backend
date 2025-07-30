module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Nguoi_Dung', 'anhDD', {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Nguoi_Dung', 'anhDD', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};