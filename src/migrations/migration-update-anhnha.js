module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Anh_Nha', 'duongDan', {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Anh_Nha', 'duongDan', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};