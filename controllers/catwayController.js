/** @file controllers/catwayController.js */
const service = require('../services/catwaysService');

/** @function getAll - Récupère tous les catways et affiche la vue correspondante. */
exports.getAll = async (req, res) => {
    try { const catways = await service.findAll(); res.render('catways', { catways, error: null }); }
    catch (e) { res.status(500).send("Erreur"); }
};

/** @function add - Ajoute un nouveau catway après vérification de l'existence du numéro. */
exports.add = async (req, res) => {
    try {
        if (await service.findByNumber(req.body.catwayNumber)) {
            const catways = await service.findAll();
            return res.render('catways', { catways, error: "Numéro existant." });
        }
        await service.add(req.body); res.redirect('/catways');
    } catch (e) { res.status(500).send("Erreur"); }
};

/** @function updateState - Met à jour l'état d'un catway spécifique via son identifiant. */
exports.updateState = async (req, res) => {
    try { await service.updateState(req.params.id, req.body.catwayState); res.status(200).send(); }
    catch (e) { res.status(500).send("Erreur"); }
};

/** @function delete - Supprime un catway via son identifiant. */
exports.delete = async (req, res) => {
    try { await service.delete(req.params.id); res.redirect('/catways'); }
    catch (e) { res.status(500).send("Erreur"); }
};