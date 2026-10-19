const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnchantmentConflict = sequelize.define('EnchantmentConflict', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    enchantment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    conflicts_with_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'enchantment_conflicts',
    timestamps: false,
    freezeTableName: true
});

module.exports = EnchantmentConflict;
