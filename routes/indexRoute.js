/** 
 * @file routes/index.js 
 * @description Routes d'accès public et gestion du dashboard. 
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

/** @function GET / - Affiche la page de connexion. */
router.get('/', (req, res) => res.render('index', { title: 'Port de Plaisance', error: null }));

/** @function POST /login - Traite la connexion utilisateur. */
router.post('/login', authController.login);

/** @function GET /dashboard - Affiche le tableau de bord sécurisé. */
router.get('/dashboard', auth.checkJWT, authController.getDashboard);

/** @function GET /logout - Déconnecte l'utilisateur. */
router.get('/logout', auth.checkJWT, authController.logout);

/** @function GET /api/dashboard-data - Fournit les données des réservations pour le dashboard asynchrone. */
router.get('/api/dashboard-data', auth.checkJWT, authController.getDashboardData);

module.exports = router;