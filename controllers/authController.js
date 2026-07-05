/** 
 * @file controllers/authController.js 
 * @description Contrôleur gérant la logique d'authentification et du tableau de bord.
 */
const authService = require('../services/authservice.js');
const Reservation = require('../models/reservationModel');

/** 
 * @function login 
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} res - Réponse HTTP Express.
 * @description Vérifie les identifiants via le service et gère la session (cookie/redirection). 
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token } = await authService.authenticate(email, password);
        
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.render('index', { title: 'Port de Plaisance', error: error.message });
    }
};

/** 
 * @function getDashboardData
 * @param {Object} req - Requête HTTP.
 * @param {Object} res - Réponse HTTP.
 * @description Route API pour récupérer les réservations en format JSON pour le dashboard asynchrone.
 */
exports.getDashboardData = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du chargement des données" });
    }
};

/** 
 * @function getDashboard 
 * @param {Object} req - Requête HTTP.
 * @param {Object} res - Réponse HTTP.
 * @description Affiche la vue du tableau de bord sécurisé.
 */
exports.getDashboard = (req, res) => {
    try {
        const user = req.decoded.user; 
        res.render('dashboard', { 
            userName: user.username || 'Utilisateur',
            email: user.email,
            date: new Date().toLocaleDateString('fr-FR')
        });
    } catch (error) {
        res.redirect('/');
    }
};

/** 
 * @function logout 
 * @param {Object} req - Requête HTTP.
 * @param {Object} res - Réponse HTTP.
 * @description Déconnecte l'utilisateur et supprime le cookie d'authentification. 
 */
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};