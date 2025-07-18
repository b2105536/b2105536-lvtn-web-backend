'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Phong.belongsTo(models.Nha, {
        foreignKey: 'nhaId'
      });
      Phong.belongsTo(models.BangMa, {
        foreignKey: 'ttPhongId'
      });
    }
  }
  Phong.init({
    tenPhong: DataTypes.STRING,
    coGacXep: DataTypes.BOOLEAN,
    giaThue: DataTypes.STRING,
    dienTich: DataTypes.STRING,
    sucChua: DataTypes.INTEGER,
    ttPhongId: DataTypes.STRING,
    nhaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Phong',
    tableName: 'Phong',
  });
  return Phong;
};