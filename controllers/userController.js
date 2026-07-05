/** @file controllers/userController.js */
const service = require('../services/usersService');

/** @function getAll - Récupère tous les utilisateurs et affiche la vue de gestion. */
exports.getAll = async (req, res) => {
    try { const users = await service.findAll(); res.render('users', { users, error: null }); }
    catch (e) { res.status(500).send("Erreur"); }
};

/** @function add - Valide la longueur du mot de passe et ajoute un utilisateur. */
exports.add = async (req, res) => {
    try {
        if (req.body.password.length < 8) {
            const users = await service.findAll();
            return res.render('users', { users, error: "Mot de passe court." });
        }
        await service.add(req.body); res.redirect('/users');
    } catch (e) {
        const users = await service.findAll();
        res.render('users', { users, error: "Email déjà utilisé." });
    }
};

/** @function editView - Affiche la vue de modification d'un utilisateur spécifique. */
exports.editView = async (req, res) => {
    try { const user = await service.findById(req.params.id); res.render('user-edit', { user, error: null }); }
    catch (e) { res.status(500).send("Erreur"); }
};

/** @function update - Met à jour les informations d'un utilisateur. */
exports.update = async (req, res) => {
    try { await service.update(req.params.id, req.body); res.redirect('/users'); }
    catch (e) { res.status(500).send("Erreur"); }
};

/** @function delete - Supprime un utilisateur. */
exports.delete = async (req, res) => {
    try { await service.delete(req.params.id); res.redirect('/users'); }
    catch (e) { res.status(500).send("Erreur"); }
};