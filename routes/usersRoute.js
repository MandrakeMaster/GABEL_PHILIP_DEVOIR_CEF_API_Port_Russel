/** @file routes/users.js @description Routes sécurisées pour la gestion des utilisateurs. */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

/** @function GET / - Liste tous les utilisateurs. */
router.get('/', auth.checkJWT, userController.getAll);

/** @function POST /add - Ajoute un nouvel utilisateur. */
router.post('/add', auth.checkJWT, userController.add);

/** @function GET /edit/:id - Affiche la vue de modification utilisateur. */
router.get('/edit/:id', auth.checkJWT, userController.editView);

/** @function POST /update/:id - Met à jour un utilisateur. */
router.post('/update/:id', auth.checkJWT, userController.update);

/** @function GET /delete/:id - Supprime un utilisateur. */
router.get('/delete/:id', auth.checkJWT, userController.delete);

module.exports = router;