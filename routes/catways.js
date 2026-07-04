/**
 * @file routes/catways.js
 * @description Gestion des routes relatives aux catways.
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const service = require('../services/catways');

// Routes pour les Catways protégées par authentification JWT
router.get('/', auth.checkJWT, service.getAll);
router.get('/:id', auth.checkJWT, service.getById);
router.post('/', auth.checkJWT, service.add);
router.put('/:id', auth.checkJWT, service.update);
router.delete('/:id', auth.checkJWT, service.delete);

module.exports = router;