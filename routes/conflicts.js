const express = require('express');
const router = express.Router();
const controller = require('../controllers/conflict');

// GET /api/enchantment-conflicts
router.get('/', controller.getAll);

// GET /api/enchantment-conflicts/:id
router.get('/:id', controller.get);

// POST /api/enchantment-conflicts
router.post('/', controller.storeModello);

// PATCH/PUT /api/enchantment-conflicts/:id
router.patch('/:id', controller.updateModello);
router.put('/:id', controller.updateModello);

// DELETE /api/enchantment-conflicts/:id
router.delete('/:id', controller.deleteModello);

module.exports = router;
