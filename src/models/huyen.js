'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Huyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Huyen.belongsTo(models.Tinh, {
        foreignKey: 'tinhId'
      });
      Huyen.hasMany(models.Xa, {
        foreignKey: 'huyenId'
      });
    }
  }
  Huyen.init({
    tenHuyen: DataTypes.STRING,
    tinhId: DataTypes.INTEGER,
    ttDVHCId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Huyen',
    tableName: 'Huyen',
  });
  return Huyen;
};