const express = require('express');
const router = express.Router();

const service= require('../services/users');

const auth = require('../middlewares/auth');


// Lister tous les utilisateurs
router.get('/', auth.checkJWT, service.getAll);
// Récupérer les détails d'un utilisateurs avec son email
router.get('/:email', auth.checkJWT, service.getByEmail);
// Créer un utilisateur
router.post('/', service.add);
// Modifier un utilisateur
router.put('/:email', auth.checkJWT, service.update);
// Supprimer un uyilisateur
router.delete('/:email', auth.checkJWT, service.delete);

// Route /authenticate
router.post('/login', service.login);

module.exports = router;
