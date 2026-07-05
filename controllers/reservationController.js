/** 
 * @file controllers/reservationController.js 
 * @description Contrôleur gérant les requêtes HTTP pour les Réservations.
 */
const service = require('../services/reservationsService');
const catwaysService = require('../services/catwaysService');

/** @function getAll - Liste toutes les réservations et les catways associés. */
exports.getAll = async (req, res) => {
    try {
        const reservations = await service.findAll();
        const catways = await catwaysService.findAll();
        
        res.render('reservations', { 
            reservations: reservations, 
            catways: catways, 
            error: req.query.error 
        });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des données.");
    }
};

/** @function add - Valide la disponibilité et les dates, puis ajoute une réservation. */
exports.add = async (req, res) => {
    try {
        if (!(await service.isAvailable(req.body.catwayNumber))) {
            return res.redirect('/reservations?error=Catway indisponible ou en réparation');
        }
        if (await service.hasConflict(req.body.catwayNumber, req.body.startDate, req.body.endDate)) {
            return res.redirect('/reservations?error=Catway déjà réservé à ces dates');
        }
        await service.add(req.body);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send("Erreur lors de la création de la réservation.");
    }
};

/** @function getEditForm - Affiche le formulaire de modification avec les réservations liées au catway. */
exports.getEditForm = async (req, res) => {
    try {
        const reservation = await service.findById(req.params.id);
        if (!reservation) return res.status(404).send("Non trouvé.");
        
        const relatedReservations = await service.findAll(); 
        const filteredRelated = relatedReservations.filter(r => r.catwayNumber == reservation.catwayNumber);

        res.render('reservation-edit', { 
            reservation, 
            relatedReservations: filteredRelated, 
            error: req.query.error 
        });
    } catch (error) {
        res.status(500).send("Erreur lors de l'accès à la modification.");
    }
};

/** @function update - Vérifie les conflits et met à jour une réservation existante. */
exports.update = async (req, res) => {
    try {
        if (!(await service.isAvailable(req.body.catwayNumber))) {
            return res.redirect(`/reservations/edit/${req.params.id}?error=Catway indisponible ou en réparation`);
        }
        if (await service.hasConflict(req.body.catwayNumber, req.body.startDate, req.body.endDate, req.params.id)) {
            return res.redirect(`/reservations/edit/${req.params.id}?error=Catway déjà réservé à ces dates`);
        }
        await service.update(req.params.id, req.body);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour.");
    }
};

/** @function delete - Supprime une réservation. */
exports.delete = async (req, res) => {
    try {
        await service.delete(req.params.id);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression.");
    }
};