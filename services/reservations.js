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

    // --- AJOUT DE LA VÉRIFICATION D'ÉTAT ---
    // On vérifie si l'état contient "réparation" (insensible à la casse)
    const state = catway.catwayState.toLowerCase();
    if (state.includes('réparation') || state.includes('indisponible')) {
        return res.status(400).json({ message: "Erreur : Ce catway est en réparation ou indisponible." });
    }
    // ---------------------------------------

    // Préparation des dates pour la vérification
    const newStart = new Date(req.body.startDate);
    const newEnd = new Date(req.body.endDate);

    // 2. Vérifier les chevauchements
    const overlapping = await Reservation.find({
        catwayNumber: req.params.id, 
        startDate: { $lt: newEnd },
        endDate: { $gt: newStart }
    });

    if (overlapping.length > 0) {
        return res.status(400).json({ message: "Erreur : Ce catway est déjà réservé sur ces dates." });
    }

    // 3. Si tout est bon, on crée la réservation
    const reservation = new Reservation({ ...req.body, catwayNumber: req.params.id });
    await reservation.save();
    res.status(201).json(reservation);
};

exports.update = async (req, res) => {
    // 1. Vérifier si le catway est disponible (en cas de changement ou maintien)
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    
    if (!catway) {
        return res.status(404).json({ message: "Le catway demandé n'existe pas." });
    }

    // Vérification de l'état du catway
    const state = catway.catwayState.toLowerCase();
    if (state.includes('réparation') || state.includes('indisponible')) {
        return res.status(400).json({ message: "Erreur : Ce catway est en réparation ou indisponible et ne peut être mis à jour." });
    }

    const { startDate, endDate } = req.body;
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    // 2. Vérifier les chevauchements avec d'AUTRES réservations
    const overlapping = await Reservation.find({
        catwayNumber: req.params.id,
        _id: { $ne: req.params.idReservation }, 
        startDate: { $lt: newEnd },
        endDate: { $gt: newStart }
    });

    if (overlapping.length > 0) {
        return res.status(400).json({ message: "Erreur : Ce catway sera déjà occupé sur ces nouvelles dates." });
    }

    // 3. Procéder à la mise à jour
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