/**
 * @file models/reservation.js
 * @description Modèle de données pour une réservation[cite: 18].
 */
const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    catwayNumber: { type: Number, required: true },
    clientName: { type: String, required: true },
    boatName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);