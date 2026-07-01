const express = require('express');
const router = express.Router();

const service= require('../services/users');


// Lister tous les utilisateurs
router.get('/', service.getAll);
// Récupérer les détails d'un utilisateurs avec son email
router.get('/:email');
// Créer un utilisateur
router.post('/', service.add);
// Modifier un utilisateur
router.put('/:email', service.update);
// Supprimer un uyilisateur
router.delete('/:email', service.delete);

module.exports = router;
