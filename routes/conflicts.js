const express = require('express');
const router = express.Router();
const controller = require('../controllers/conflict');

// GET /api/conflicts
router.get('/', controller.getAll);

// GET /api/conflicts/:id
router.get('/:id', controller.get);

// POST /api/conflicts
router.post('/', controller.storeConflitto);

// PATCH/PUT /api/conflicts/:id
router.patch('/:id', controller.updateConflitto);
router.put('/:id', controller.updateConflitto);

// DELETE /api/conflicts/:id
router.delete('/:id', controller.deleteConflitto);

module.exports = router;
