const Catway = require('../models/catway');

exports.getAll = async (req, res) => {
    const catways = await Catway.find();
    res.status(200).json(catways);
};

exports.getById = async (req, res) => {
    // On utilise catwayNumber comme identifiant métier
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    catway ? res.status(200).json(catway) : res.status(404).json({ message: "Introuvable" });
};

exports.add = async (req, res) => {
    const catway = new Catway(req.body);
    await catway.save();
    res.status(201).json(catway);
};

exports.update = async (req, res) => {
    // Seul catwayState est modifiable
    const updated = await Catway.findOneAndUpdate(
        { catwayNumber: req.params.id }, 
        { catwayState: req.body.catwayState }, 
        { new: true }
    );
    res.status(200).json(updated);
};

exports.delete = async (req, res) => {
    await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    res.status(200).json({ message: "Supprimé avec succès" });
};