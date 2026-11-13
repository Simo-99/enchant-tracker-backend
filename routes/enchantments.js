const express = require('express');
const router = express.Router();
const controller = require('../controllers/enchantment');

// GET /api/enchantments
router.get('/', controller.getAll);

// GET /api/enchantments/:id
router.get('/:id', controller.get);

// POST /api/enchantments
router.post('/', controller.storeModello);

// PATCH /api/enchantments/:id/found (retrocompatibilità) e PUT/PATCH /:id
router.patch('/:id/found', controller.updateModello);
router.patch('/:id', controller.updateModello);
router.put('/:id', controller.updateModello);

// DELETE /api/enchantments/:id
router.delete('/:id', controller.deleteModello);

module.exports = router;
