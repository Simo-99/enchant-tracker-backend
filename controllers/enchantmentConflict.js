
const { EnchantmentConflict} = require('../models/load');

// GET ALL
const getAll = async (req, res) => {
    const conflicts = await EnchantmentConflict.findAll();
    res.json(conflicts);
};

// GET
const get = async (req, res) => {
    const conflict = await EnchantmentConflict.findByPk(req.params.id);

    if (!conflict)
        return res.status(404).json({ error: 'Conflitto non trovato' });

    res.json(conflict);
};

// CREATE
const storeModello = async (req, res) => {
    const conflict = await EnchantmentConflict.create(req.body);
    res.status(201).json(conflict);
};

// UPDATE
const updateModello = async (req, res) => {
    const conflict = await EnchantmentConflict.findByPk(req.params.id);

    if (!conflict)
        return res.status(404).json({ error: 'Conflitto non trovato' });

    const { enchantment_id, conflicting_enchantment_id } = req.body;
    Object.assign(conflict, { enchantment_id, conflicting_enchantment_id });

    await conflict.save();
    res.json(conflict);
};

// DELETE
const deleteModello = async (req, res) => {
    const conflict = await EnchantmentConflict.findByPk(req.params.id);

    if (!conflict)
        return res.status(404).json({ error: 'Conflitto non trovato' });

    await conflict.destroy();
    res.json({ message: 'Conflitto eliminato con successo' });
};

module.exports = { getAll, get, storeModello, updateModello, deleteModello };
