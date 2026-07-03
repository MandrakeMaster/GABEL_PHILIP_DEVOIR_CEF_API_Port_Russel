const express = require('express');
const router = express.Router({ mergeParams: true });
const service = require('../services/reservations');
const auth = require('../middlewares/auth');

router.get('/', auth.checkJWT, service.getAllByCatway);             // GET /catways/:id/reservations
router.get('/:idReservation', auth.checkJWT, service.getById);      // GET /catways/:id/reservations/:idReservation
router.post('/', auth.checkJWT, service.add);                       // POST /catways/:id/reservations
router.put('/:idReservation', auth.checkJWT, service.update);       // PUT /catways/:id/reservations/:idReservation
router.delete('/:idReservation', auth.checkJWT, service.delete);    // DELETE /catways/:id/reservations/:idReservation

module.exports = router;