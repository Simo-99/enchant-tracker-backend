
const { Enchantment } = require('../models/load');

// GET ALL
const getAll = async (req, res) => {
    const { type, source, found } = req.query;
    const where = {
        ...(type && { type }),
        ...(source && { source }),
        ...(found !== undefined && { found: found === 'true' })
    };

    const enchantments = await Enchantment.findAll({ where, include: [{model: Enchantment,as: 'conflicts'}] });

    res.json(enchantments);
};

// GET
const get = async (req, res) => {
    const enchantment = await Enchantment.findByPk(req.params.id, {
        include: [{
            model: Enchantment,
            as: 'conflicts',
            through: { attributes: [] }
        }]
    });

    if (!enchantment)
        return res.status(404).json({ error: 'Incantesimo non trovato' });

    res.json(enchantment);
};

// CREATE
const storeModello = async (req, res) => {
    const enchantment = await Enchantment.create(req.body);
    res.status(201).json(enchantment);
};

// UPDATE
const updateModello = async (req, res) => {
    try {
        const { id } = req.params;
        const enchantment = await Enchantment.findByPk(id);

        if (!enchantment) {
            return res.status(404).json({ error: 'Incantesimo non trovato' });
        }

        // Aggiorna solo i campi che sono stati realmente inviati nel body
        // (es. se mandi solo { found: true }, aggiornerà solo found)
        await enchantment.update(req.body, { 
            fields: Object.keys(req.body) // Dice a Sequelize di toccare solo i campi passati
        });

        return res.json(enchantment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// DELETE
const deleteModello = async (req, res) => {
    const enchantment = await Enchantment.findByPk(req.params.id);

    if (!enchantment)
        return res.status(404).json({ error: 'Incantesimo non trovato' });

    await enchantment.destroy();
    res.json({ message: 'Incantesimo eliminato con successo' });
};

module.exports = { getAll, get, storeModello, updateModello, deleteModello };
