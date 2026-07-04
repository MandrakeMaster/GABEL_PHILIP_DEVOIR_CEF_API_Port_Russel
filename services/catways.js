/**
 * @file services/catways.js
 * @description Fonctions de gestion CRUD pour les Catways[cite: 5].
 */
const Catway = require('../models/catway');

/** @function getAll - Récupère tous les catways[cite: 5]. */
exports.getAll = async (req, res) => {
    const catways = await Catway.find();
    res.status(200).json(catways);
};

/** @function getById - Récupère un catway par son numéro métier[cite: 5]. */
exports.getById = async (req, res) => {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    catway ? res.status(200).json(catway) : res.status(404).json({ message: "Introuvable" });
};

/** @function add - Crée un nouveau catway[cite: 5]. */
exports.add = async (req, res) => {
    const catway = new Catway(req.body);
    await catway.save();
    res.status(201).json(catway);
};

/** @function update - Modifie l'état d'un catway[cite: 5]. */
exports.update = async (req, res) => {
    const updated = await Catway.findOneAndUpdate(
        { catwayNumber: req.params.id }, 
        { catwayState: req.body.catwayState }, 
        { new: true }
    );
    res.status(200).json(updated);
};

/** @function delete - Supprime un catway[cite: 5]. */
exports.delete = async (req, res) => {
    await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    res.status(200).json({ message: "Supprimé avec succès" });
};