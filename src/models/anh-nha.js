'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnhNha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AnhNha.belongsTo(models.Nha, {
        foreignKey: 'nhaId'
      });
    }
  }
  AnhNha.init({
    duongDan: DataTypes.STRING,
    nhaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AnhNha',
    tableName: 'Anh_Nha',
  });
  return AnhNha;
};