const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enchantment = sequelize.define('Enchantment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING, allowNull: false },
    max_level: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT },
    found: { type: DataTypes.BOOLEAN, defaultValue: false },
    sword: { type: DataTypes.BOOLEAN, defaultValue: false },
    axe: { type: DataTypes.BOOLEAN, defaultValue: false },
    pickaxe: { type: DataTypes.BOOLEAN, defaultValue: false },
    shovel: { type: DataTypes.BOOLEAN, defaultValue: false },
    hoe: { type: DataTypes.BOOLEAN, defaultValue: false },
    helmet: { type: DataTypes.BOOLEAN, defaultValue: false },
    chestplate: { type: DataTypes.BOOLEAN, defaultValue: false },
    leggings: { type: DataTypes.BOOLEAN, defaultValue: false },
    boots: { type: DataTypes.BOOLEAN, defaultValue: false },
    bow: { type: DataTypes.BOOLEAN, defaultValue: false },
    crossbow: { type: DataTypes.BOOLEAN, defaultValue: false },
    trident: { type: DataTypes.BOOLEAN, defaultValue: false },
    mace: { type: DataTypes.BOOLEAN, defaultValue: false },
    spear: { type: DataTypes.BOOLEAN, defaultValue: false },
    shield: { type: DataTypes.BOOLEAN, defaultValue: false },
    fishing_rod: { type: DataTypes.BOOLEAN, defaultValue: false },
    elytra: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.STRING(1), allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'Enchantments',
    timestamps: false
});

module.exports = Enchantment;
