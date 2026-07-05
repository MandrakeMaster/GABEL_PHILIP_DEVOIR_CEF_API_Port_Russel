/** @file routes/reservationsRoute.js @description Routes de gestion des réservations. */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const reservationController = require('../controllers/reservationController');

/** @function GET / - Liste toutes les réservations. */
router.get('/', auth.checkJWT, reservationController.getAll);

/** @function POST /add - Crée une réservation. */
router.post('/add', auth.checkJWT, reservationController.add);

/** @function GET /edit/:id - Affiche le formulaire de modification. */
router.get('/edit/:id', auth.checkJWT, reservationController.getEditForm);

/** @function POST /update/:id - Met à jour une réservation. */
router.post('/update/:id', auth.checkJWT, reservationController.update);

/** @function GET /delete/:id - Supprime une réservation. */
router.get('/delete/:id', auth.checkJWT, reservationController.delete);

module.exports = router;