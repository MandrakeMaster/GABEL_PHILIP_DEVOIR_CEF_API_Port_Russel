/** 
 * @file services/authService.js 
 * @description Logique métier pour l'authentification des utilisateurs.
 */
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/** 
 * @function authenticate
 * @param {string} email - Email de l'utilisateur.
 * @param {string} password - Mot de passe en clair.
 * @returns {Object} - Objet contenant l'utilisateur et le token JWT.
 * @throws {Error} - Si l'utilisateur n'existe pas ou si le mot de passe est incorrect.
 */
exports.authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mot de passe incorrect');
    
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '24h' });
    return { user, token };
};