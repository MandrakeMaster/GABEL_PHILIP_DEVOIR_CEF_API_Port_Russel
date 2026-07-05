/** @file services/usersService.js @description Logique métier pour les Utilisateurs. */
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

/** @function findAll - Liste tous les utilisateurs. */
exports.findAll = async () => await User.find();

/** @function findById - Récupère un utilisateur par ID. */
exports.findById = async (id) => await User.findById(id);

/** @function findByEmail - Récupère un utilisateur par email. */
exports.findByEmail = async (email) => await User.findOne({ email });

/** @function add - Ajoute un utilisateur avec hachage du mot de passe. */
exports.add = async (data) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return await new User(data).save();
};

/** @function update - Met à jour les infos utilisateur (avec hachage optionnel). */
exports.update = async (id, data) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return await User.findByIdAndUpdate(id, data, { runValidators: true });
};

/** @function delete - Supprime un utilisateur par ID. */
exports.delete = async (id) => await User.findByIdAndDelete(id);