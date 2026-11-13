const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnchantmentConflict = sequelize.define('EnchantmentConflict', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enchantment_id: DataTypes.INTEGER,
    conflicts_with_id: DataTypes.INTEGER
}, 
{ tableName: 'enchantment_conflicts', timestamps: false });

module.exports = EnchantmentConflict;
