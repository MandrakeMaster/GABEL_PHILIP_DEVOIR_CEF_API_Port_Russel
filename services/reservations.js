const Reservation = require('../models/reservation');
const Catway = require('../models/catway');


// Lister toutes les réservations d'un catway spécifique
exports.getAllByCatway = async (req, res) => {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
};

// Récupérer une réservation spécifique (via son _id MongoDB)
exports.getById = async (req, res) => {
    const reservation = await Reservation.findOne({ 
        _id: req.params.idReservation, 
        catwayNumber: req.params.id 
    });
    reservation ? res.status(200).json(reservation) : res.status(404).json({ message: "Introuvable" });
};

exports.add = async (req, res) => {
    // 1. Vérifier si le catway existe
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    
    if (!catway) {
        return res.status(404).json({ message: "Le catway demandé n'existe pas." });
    }

    // 2. Si le catway existe, on crée la réservation
    const reservation = new Reservation({ ...req.body, catwayNumber: req.params.id });
    await reservation.save();
    res.status(201).json(reservation);
};

exports.update = async (req, res) => {
    // La consigne demande PUT /catways/:id/reservations/:idReservation (implicite pour une modification unitaire)
    const updated = await Reservation.findOneAndUpdate(
        { _id: req.params.idReservation, catwayNumber: req.params.id }, 
        req.body, 
        { new: true }
    );
    updated ? res.status(200).json(updated) : res.status(404).json({ message: "Réservation non trouvée" });
};

exports.delete = async (req, res) => {
    await Reservation.findOneAndDelete({ _id: req.params.idReservation, catwayNumber: req.params.id });
    res.status(200).json({ message: "Réservation supprimée" });
};