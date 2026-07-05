/** 
 * @file routes/catways.js 
 * @description Routes sécurisées pour la gestion des catways. 
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const catwayController = require('../controllers/catwayController');

/** @function GET / - Liste tous les catways. */
router.get('/', auth.checkJWT, catwayController.getAll);

/** @function POST /add - Ajoute un nouveau catway. */
router.post('/add', auth.checkJWT, catwayController.add);

/** @function POST /updateState/:id - Met à jour l'état d'un catway. */
router.post('/updateState/:id', auth.checkJWT, catwayController.updateState);

/** @function GET /delete/:id - Supprime un catway. */
router.get('/delete/:id', auth.checkJWT, catwayController.delete);

module.exports = router;