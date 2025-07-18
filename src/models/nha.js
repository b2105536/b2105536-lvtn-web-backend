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
      Nha.belongsTo(models.NguoiDung, {
        foreignKey: 'chuTroId'
      });
      Nha.belongsTo(models.Xa, {
        foreignKey: 'xaId'
      });
      Nha.hasMany(models.AnhNha, {
        foreignKey: 'nhaId'
      });
      Nha.hasMany(models.Phong, {
        foreignKey: 'nhaId'
      });
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