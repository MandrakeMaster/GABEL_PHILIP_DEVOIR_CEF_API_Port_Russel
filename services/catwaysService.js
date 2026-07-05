/** @file services/catwaysService.js @description Logique métier pour les Catways. */
const Catway = require('../models/catwayModel');

/** @function findAll - Récupère la liste complète des catways. */
exports.findAll = async () => await Catway.find();

/** @function findByNumber - Cherche un catway par son numéro. */
exports.findByNumber = async (catwayNumber) => await Catway.findOne({ catwayNumber });

/** @function add - Crée un nouveau catway. */
exports.add = async (data) => await new Catway(data).save();

/** @function updateState - Met à jour l'état d'un catway par son ID. */
exports.updateState = async (id, catwayState) => await Catway.findByIdAndUpdate(id, { catwayState });

/** @function delete - Supprime un catway par son ID. */
exports.delete = async (id) => await Catway.findByIdAndDelete(id);