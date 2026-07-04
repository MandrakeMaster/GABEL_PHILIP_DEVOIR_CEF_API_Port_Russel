/**
 * @file services/reservations.js
 * @description Gestion des réservations incluant la vérification des conflits et la disponibilité des catways.
 */
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * @function isAvailable
 * @description Vérifie si un catway est disponible (non en réparation ou indisponible).
 */
const isAvailable = async (catwayNumber) => {
    const catway = await Catway.findOne({ catwayNumber: catwayNumber });
    if (!catway) return false;
    const state = (catway.catwayState || "").toLowerCase();
    return !state.includes('réparation') && !state.includes('indisponible');
};

/** @function add - Crée une réservation après vérifications métier[cite: 6]. */
exports.add = async (req, res) => {
    try {
        const catwayNumber = Number(req.body.catwayNumber);
        
        // 1. Vérification de l'état du catway
        if (!(await isAvailable(catwayNumber))) {
            return res.redirect('/reservations?error=catway_unavailable');
        }

        // 2. Vérification des dates
        const newStart = new Date(req.body.startDate).getTime();
        const newEnd = new Date(req.body.endDate).getTime();
        if (newStart >= newEnd) return res.redirect('/reservations?error=invalid_dates');

        const reservations = await Reservation.find({ catwayNumber: catwayNumber });
        const conflict = reservations.find(r => {
            const start = new Date(r.startDate).getTime();
            const end = new Date(r.endDate).getTime();
            return (start < newEnd && end > newStart);
        });

        if (conflict) return res.redirect('/reservations?error=conflict');

        // 3. Sauvegarde de la réservation
        await new Reservation({ 
            catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }).save();
        
        res.redirect('/reservations');
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).send("Erreur lors de la réservation.");
    }
};

/** @function update - Met à jour une réservation existante[cite: 6]. */
exports.update = async (req, res) => {
    try {
        const catwayNumber = Number(req.body.catwayNumber);
        
        // Vérification de l'état du catway lors de la modification
        if (!(await isAvailable(catwayNumber))) {
            return res.redirect(`/reservations/edit/${req.params.idReservation}?error=catway_unavailable`);
        }

        await Reservation.findByIdAndUpdate(req.params.idReservation, req.body);
        res.redirect('/reservations');
    } catch (err) {
        res.status(500).send("Erreur de mise à jour");
    }
};

/** @function getAll - Récupère toutes les réservations. */
exports.getAll = async (req, res) => {
    const reservations = await Reservation.find();
    const catways = await Catway.find();
    res.render('reservations', { reservations, catways, error: req.query.error });
};

/** @function getById - Récupère une réservation par son ID. */
exports.getById = async (req, res) => {
    const reservation = await Reservation.findById(req.params.idReservation);
    res.render('reservation-details', { reservation });
};

/** @function delete - Supprime une réservation. */
exports.delete = async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.idReservation);
    res.redirect('/reservations');
};