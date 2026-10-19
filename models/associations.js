const Enchantment = require('./Enchantment');
const EnchantmentConflict = require('./EnchantmentConflict');

Enchantment.hasMany(EnchantmentConflict, {
    foreignKey: 'enchantment_id',
    as: 'conflicts'
});

EnchantmentConflict.belongsTo(Enchantment, {
    foreignKey: 'conflicts_with_id',
    as: 'conflictsWith'
});

module.exports = { Enchantment, EnchantmentConflict };
