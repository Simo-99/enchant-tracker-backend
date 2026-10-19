const express = require('express');
const { Op } = require('sequelize');
const {
    Enchantment,
    EnchantmentConflict
} = require('../models/associations');

const router = express.Router();

const allowedTypes = [
    'sword', 'axe', 'pickaxe', 'shovel', 'hoe',
    'helmet', 'chestplate', 'leggings', 'boots',
    'bow', 'crossbow', 'trident', 'mace',
    'shield', 'fishing_rod', 'elytra'
];

// GET /api/enchantments?type=sword&source=vanilla&found=false
router.get('/', async (req, res) => {
    try {
        const { type, source, found } = req.query;
        const where = {};

        if (type !== undefined) {
            if (typeof type !== 'string' || !allowedTypes.includes(type)) {
                return res.status(400).json({
                    error: 'Tipo di oggetto non valido',
                    allowedTypes
                });
            }
            where[type] = true;
        }

        if (source !== undefined) {
            if (!['vanilla', 'custom'].includes(source)) {
                return res.status(400).json({
                    error: 'Il filtro source deve essere vanilla o custom'
                });
            }
            where.source = source;
        }

        if (found !== undefined) {
            if (!['true', 'false'].includes(found)) {
                return res.status(400).json({
                    error: 'Il filtro found deve essere true o false'
                });
            }
            where.found = found === 'true';
        }

        const enchantments = await Enchantment.findAll({
            where,
            order: [['name', 'ASC']]
        });

        return res.json(enchantments);
    } catch (error) {
        console.error('GET /api/enchantments:', error);
        return res.status(500).json({
            error: 'Errore nel recupero degli incantesimi'
        });
    }
});

// GET /api/enchantments/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID non valido' });
        }

        const enchantment = await Enchantment.findByPk(id, {
            include: [{
                model: EnchantmentConflict,
                as: 'conflicts',
                include: [{
                    model: Enchantment,
                    as: 'conflictsWith',
                    attributes: ['id', 'name', 'source', 'max_level']
                }]
            }]
        });

        if (!enchantment) {
            return res.status(404).json({ error: 'Incantesimo non trovato' });
        }

        return res.json(enchantment);
    } catch (error) {
        console.error('GET /api/enchantments/:id:', error);
        return res.status(500).json({
            error: 'Errore nel recupero dell’incantesimo'
        });
    }
});

// PATCH /api/enchantments/:id/found
// Accetta esclusivamente { "found": true } oppure { "found": false }.
router.patch('/:id/found', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { found } = req.body || {};

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID non valido' });
        }

        if (typeof found !== 'boolean') {
            return res.status(400).json({
                error: 'Il campo found deve essere un booleano true o false'
            });
        }

        const enchantment = await Enchantment.findByPk(id);

        if (!enchantment) {
            return res.status(404).json({ error: 'Incantesimo non trovato' });
        }

        await enchantment.update({ found });

        return res.json({
            id: enchantment.id,
            name: enchantment.name,
            found: enchantment.found
        });
    } catch (error) {
        console.error('PATCH /api/enchantments/:id/found:', error);
        return res.status(500).json({
            error: 'Errore nell’aggiornamento del campo found'
        });
    }
});

// POST /api/enchantments
router.post('/', async (req, res) => {
    try {
        const {
            name,
            source,
            max_level,
            description,
            sword, axe, pickaxe, shovel, hoe,
            helmet, chestplate, leggings, boots,
            bow, crossbow, trident, mace, shield,
            fishing_rod, elytra,
            conflicts // Array di ID degli incantesimi in conflitto (es. [1, 5, 12])
        } = req.body;

        // Validazione di base
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Il campo name è obbligatorio' });
        }

        if (source && !['vanilla', 'custom'].includes(source)) {
            return res.status(400).json({ error: 'Il campo source deve essere vanilla o custom' });
        }

        // 1. Creazione dell'incantesimo
        const newEnchantment = await Enchantment.create({
            name: name.trim(),
            source: source || 'custom',
            max_level: max_level ? Number(max_level) : 1,
            description: description || '',
            sword: Boolean(sword),
            axe: Boolean(axe),
            pickaxe: Boolean(pickaxe),
            shovel: Boolean(shovel),
            hoe: Boolean(hoe),
            helmet: Boolean(helmet),
            chestplate: Boolean(chestplate),
            leggings: Boolean(leggings),
            boots: Boolean(boots),
            bow: Boolean(bow),
            crossbow: Boolean(crossbow),
            trident: Boolean(trident),
            mace: Boolean(mace),
            shield: Boolean(shield),
            fishing_rod: Boolean(fishing_rod),
            elytra: Boolean(elytra),
            found: false // Di default quando viene creato non è ancora trovato nel server
        });

        // 2. Gestione dei conflitti (se presenti nell'array)
        if (Array.isArray(conflicts) && conflicts.length > 0) {
            // Supponendo che la tabella di associazione utilizzi campi come enchantment_id e conflicting_enchantment_id
            // Creiamo le doppie relazioni o singole a seconda di come è strutturato il tuo database dei conflitti
            const conflictRecords = [];
            for (const conflictId of conflicts) {
                const targetId = Number(conflictId);
                if (Number.isSafeInteger(targetId) && targetId > 0 && targetId !== newEnchantment.id) {
                    conflictRecords.push({
                        enchantment_id: newEnchantment.id,
                        conflicting_enchantment_id: targetId
                    });
                }
            }

            if (conflictRecords.length > 0) {
                await EnchantmentConflict.bulkCreate(conflictRecords, { ignoreDuplicates: true });
            }
        }

        // Restituisce l'incantesimo appena creato con status 201 (Created)
        return res.status(201).json(newEnchantment);

    } catch (error) {
        console.error('POST /api/enchantments:', error);
        return res.status(500).json({
            error: 'Errore durante la creazione dell’incantesimo'
        });
    }
});


// POST /api/enchantments/:id/conflicts
router.post('/:id/conflicts', async (req, res) => {
    try {
        const enchantmentId = Number(req.params.id);
        const { conflicts_with_id } = req.body;

        const targetId = Number(conflicts_with_id)

        if (!Number.isSafeInteger(enchantmentId) || !Number.isSafeInteger(targetId) || enchantmentId === targetId) {
            return res.status(400).json({ error: 'ID non validi per il conflitto' });
        }

        // Verifica che entrambi gli incantesimi esistano nel database
        const enc1 = await Enchantment.findByPk(enchantmentId);
        const enc2 = await Enchantment.findByPk(targetId);

        if (!enc1 || !enc2) {
            return res.status(404).json({ error: 'Uno o entrambi gli incantesimi non esistono' });
        }

        // Crea la prima direzione (A -> B)
        await EnchantmentConflict.findOrCreate({
            where: {
                enchantment_id: enchantmentId,
                conflicts_with_id: targetId
            }
        });

        // Crea la seconda direzione speculare (B -> A)
        await EnchantmentConflict.findOrCreate({
            where: {
                enchantment_id: targetId,
                conflicts_with_id: enchantmentId
            }
        });

        return res.status(201).json({ message: 'Conflitto bidirezionale aggiunto con successo' });

    } catch (error) {
        console.error('POST /api/enchantments/:id/conflicts:', error);
        return res.status(500).json({ error: 'Errore durante il salvataggio del conflitto' });
    }
});

// DELETE /api/enchantments/:id/conflicts/:targetId
router.delete('/:id/conflicts/:targetId', async (req, res) => {
    try {
        const enchantmentId = Number(req.params.id);
        const targetId = Number(req.params.targetId);

        if (!Number.isSafeInteger(enchantmentId) || !Number.isSafeInteger(targetId)) {
            return res.status(400).json({ error: 'ID non validi per la rimozione del conflitto' });
        }

        // Rimuove entrambe le direzioni (A -> B e B -> A) dalla tabella dei conflitti
        await EnchantmentConflict.destroy({
            where: {
                [Op.or]: [
                    { enchantment_id: enchantmentId, conflicts_with_id: targetId },
                    { enchantment_id: targetId, conflicts_with_id: enchantmentId }
                ]
            }
        });

        return res.json({ message: 'Conflitto rimosso con successo' });

    } catch (error) {
        console.error('DELETE /api/enchantments/:id/conflicts/:targetId:', error);
        return res.status(500).json({ error: 'Errore durante la rimozione del conflitto' });
    }
});

// PATCH /api/enchantments/:id/description
router.patch('/:id/description', async (req, res) => {
    try {
        const enchantmentId = Number(req.params.id);
        const { description } = req.body;

        if (!Number.isSafeInteger(enchantmentId)) {
            return res.status(400).json({ error: 'Invalid enchantment ID' });
        }

        const enchantment = await Enchantment.findByPk(enchantmentId);
        if (!enchantment) {
            return res.status(404).json({ error: 'Enchantment not found' });
        }

        // Aggiorna la descrizione
        enchantment.description = description ? description.trim() : '';
        await enchantment.save();

        return res.json({ message: 'Description updated successfully', description: enchantment.description });

    } catch (error) {
        console.error('PATCH /api/enchantments/:id/description:', error);
        return res.status(500).json({ error: 'Error updating description' });
    }
});

// PATCH /api/enchantments/:id/items
router.patch('/:id/items', async (req, res) => {
    try {
        const enchantmentId = Number(req.params.id);
        const itemFields = req.body; // Riceve un oggetto con i booleani (es. { sword: true, pickaxe: false, ... })

        if (!Number.isSafeInteger(enchantmentId)) {
            return res.status(400).json({ error: 'Invalid enchantment ID' });
        }

        const enchantment = await Enchantment.findByPk(enchantmentId);
        if (!enchantment) {
            return res.status(404).json({ error: 'Enchantment not found' });
        }

        // Lista di tutti i campi item validi nel database
        const validItems = [
            'sword', 'axe', 'pickaxe', 'shovel', 'hoe',
            'helmet', 'chestplate', 'leggings', 'boots',
            'bow', 'crossbow', 'trident', 'mace', 'shield',
            'fishing_rod', 'elytra'
        ];

        // Aggiorna solo i campi degli item passati nel body
        for (const key of validItems) {
            if (itemFields[key] !== undefined) {
                enchantment[key] = Boolean(itemFields[key]);
            }
        }

        await enchantment.save();

        return res.json({ message: 'Compatible items updated successfully', enchantment });

    } catch (error) {
        console.error('PATCH /api/enchantments/:id/items:', error);
        return res.status(500).json({ error: 'Error updating compatible items' });
    }
});

// DELETE /api/enchantments/:id
router.delete('/:id', async (req, res) => {
    try {
        const enchantmentId = Number(req.params.id);

        if (!Number.isSafeInteger(enchantmentId)) {
            return res.status(400).json({ error: 'Invalid enchantment ID' });
        }

        const enchantment = await Enchantment.findByPk(enchantmentId);
        if (!enchantment) {
            return res.status(404).json({ error: 'Enchantment not found' });
        }

        // Rimuove eventuali conflitti associati a questo incantesimo (in entrambe le direzioni)
        await EnchantmentConflict.destroy({
            where: {
                [Op.or]: [
                    { enchantment_id: enchantmentId },
                    { conflicts_with_id: enchantmentId }
                ]
            }
        });

        // Elimina l'incantesimo
        await enchantment.destroy();

        return res.json({ message: 'Enchantment deleted successfully' });

    } catch (error) {
        console.error('DELETE /api/enchantments/:id:', error);
        return res.status(500).json({ error: 'Error deleting enchantment' });
    }
});

module.exports = router;
