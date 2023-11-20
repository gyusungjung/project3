'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      content: DataTypes.TEXT,
      status: { type: DataTypes.STRING, validate: { isIn: [['FOR_SALE', 'SOLD_OUT']] } },
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};
