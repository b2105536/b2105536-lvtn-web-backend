'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Nha.init({
    ten: DataTypes.STRING,
    diaChi: DataTypes.STRING,
    moTa: DataTypes.TEXT,
    chuTroId: DataTypes.INTEGER,
    tinhId: DataTypes.INTEGER,
    huyenId: DataTypes.INTEGER,
    xaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Nha',
    tableName: 'Nha',
  });
  return Nha;
};