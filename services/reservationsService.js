/** @file services/reservationService.js @description Logique métier pour les Réservations. */
const Reservation = require('../models/reservationModel');
const Catway = require('../models/catwayModel');

/** @function findAll - Récupère toutes les réservations. */
exports.findAll = async () => await Reservation.find();

/** @function findById - Récupère une réservation spécifique. */
exports.findById = async (id) => await Reservation.findById(id);

/** @function add - Enregistre une nouvelle réservation. */
exports.add = async (data) => await new Reservation(data).save();

/** @function update - Modifie une réservation existante. */
exports.update = async (id, data) => await Reservation.findByIdAndUpdate(id, data);

/** @function delete - Supprime une réservation. */
exports.delete = async (id) => await Reservation.findByIdAndDelete(id);

/** 
 * @function isAvailable
 * @description Vérifie si le catway n'est pas en réparation ou indisponible.
 * @param {number|string} catwayNumber - Le numéro du catway à vérifier.
 * @returns {boolean} - True si disponible.
 */
exports.isAvailable = async (catwayNumber) => {
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return false;
    const state = catway.catwayState.toLowerCase().trim();
    return !state.includes('réparation') && !state.includes('indisponible');
};

/** 
 * @function hasConflict
 * @description Vérifie si une réservation entre en conflit avec une période existante.
 * @param {number} catwayNumber - Numéro du catway.
 * @param {Date} startDate - Date de début.
 * @param {Date} endDate - Date de fin.
 * @param {string} [excludeId] - Optionnel : ID à exclure (pour la mise à jour).
 * @returns {Object|undefined} - Retourne le conflit trouvé ou undefined.
 */
exports.hasConflict = async (catwayNumber, startDate, endDate, excludeId = null) => {
    const query = { catwayNumber, ...(excludeId && { _id: { $ne: excludeId } }) };
    const reservations = await Reservation.find(query);
    return reservations.find(r => 
        new Date(r.startDate).getTime() < new Date(endDate).getTime() && 
        new Date(r.endDate).getTime() > new Date(startDate).getTime()
    );
};