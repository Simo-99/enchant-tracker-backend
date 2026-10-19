const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const boolField = () => ({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
});

const Enchantment = sequelize.define('Enchantment', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    source: {
        type: DataTypes.ENUM('vanilla', 'custom'),
        allowNull: false
    },
    max_level: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    found: {
        ...boolField()
    },

    sword: boolField(),
    axe: boolField(),
    pickaxe: boolField(),
    shovel: boolField(),
    hoe: boolField(),

    helmet: boolField(),
    chestplate: boolField(),
    leggings: boolField(),
    boots: boolField(),

    bow: boolField(),
    crossbow: boolField(),
    trident: boolField(),
    mace: boolField(),

    shield: boolField(),
    fishing_rod: boolField(),
    elytra: boolField()
}, {
    tableName: 'enchantments',
    timestamps: false,
    freezeTableName: true
});

module.exports = Enchantment;
