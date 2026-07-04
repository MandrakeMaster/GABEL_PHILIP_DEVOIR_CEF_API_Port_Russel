/**
 * @file routes/reservations.js
 * @description Routeur pour les réservations déléguant la logique au service dédié.
 */
const express = require('express');
const router = express.Router({ mergeParams: true });
const service = require('../services/reservations');
const Reservation = require('../models/reservation');

/** @route GET / */
router.get('/', (req, res) => {
    service.getAll(req, res);
});

/** @route GET /:idReservation */
router.get('/:idReservation', (req, res) => {
    service.getById(req, res);
});

/** @route POST /add */
router.post('/add', (req, res) => {
    service.add(req, res);
});

/** @route GET /reservations/edit/:id */
router.get('/reservations/edit/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render('reservation-edit', { 
            reservation, 
            error: req.query.error 
        });
    } catch (error) {
        res.status(500).send("Erreur de chargement");
    }
});

/** @route GET /delete/:idReservation */
router.delete('/delete/:idReservation', (req, res) => {
    service.delete(req, res);
});

module.exports = router;