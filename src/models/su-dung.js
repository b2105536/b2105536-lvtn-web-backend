'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SuDung.belongsTo(models.HopDong, {
        foreignKey: 'hopDongId'
      });
      SuDung.belongsTo(models.DichVu, {
        foreignKey: 'dichVuId'
      });
    }
  }
  SuDung.init({
    csTrc: DataTypes.STRING,
    csSau: DataTypes.STRING,
    ngayGN: DataTypes.DATE,
    dichVuId: DataTypes.INTEGER,
    hopDongId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SuDung',
    tableName: 'Su_Dung',
  });
  return SuDung;
};