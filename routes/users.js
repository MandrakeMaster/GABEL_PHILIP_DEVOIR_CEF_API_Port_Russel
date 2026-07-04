/**
 * @file routes/users.js
 * @description Gestion des routes des utilisateurs de la capitainerie.
 */
const express = require('express');
const router = express.Router();
const service = require('../services/users');
const auth = require('../middlewares/auth');

/** @route GET / */
router.get('/', auth.checkJWT, service.getAll);

/** @route GET /:email */
router.get('/:email', auth.checkJWT, service.getByEmail);

/** @route POST / */
router.post('/', service.add);

/** @route PUT /:email */
router.put('/:email', auth.checkJWT, service.update);

/** @route DELETE /:email */
router.delete('/:email', auth.checkJWT, service.delete);

/** @route POST /login */
router.post('/login', service.login);

module.exports = router;