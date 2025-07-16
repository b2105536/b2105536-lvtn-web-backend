'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Xa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Xa.belongsTo(models.Tinh, {
        foreignKey: 'tinhId'
      });
      Xa.belongsTo(models.Huyen, {
        foreignKey: 'huyenId'
      });
    }
  }
  Xa.init({
    tenXa: DataTypes.STRING,
    huyenId: DataTypes.INTEGER,
    tinhId: DataTypes.INTEGER,
    ttDVHCId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Xa',
    tableName: 'Xa',
  });
  return Xa;
};