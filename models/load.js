const sequelize = require('../config/database');
const Enchantment = require('./Enchantment');
const EnchantmentConflict = require('./EnchantmentConflict');

// Definizione delle associazioni Sequelize
  Enchantment.belongsToMany(Enchantment, {
      through: EnchantmentConflict,
      as: 'conflicts',
      foreignKey: 'enchantment_id',
      otherKey: 'conflicts_with_id'
  });

module.exports = {
  sequelize,
  Enchantment,
  EnchantmentConflict
};
