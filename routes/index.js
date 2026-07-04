/**
 * @file routes/index.js
 * @description Routeur principal gérant l'authentification, les catways, les réservations et les utilisateurs.
 */
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Reservation = require('../models/reservation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'ton_secret_key';
const Catway = require('../models/catway');
const reservationService = require('../services/reservations');

/** @route GET / */
router.get('/', (req, res) => {
    res.render('index', { title: 'Port de Plaisance', error: null });
});

/** @route POST /login */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.render('index', { error: 'Utilisateur non trouvé' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('index', { error: 'Mot de passe incorrect' });
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.render('index', { error: 'Erreur serveur' });
    }
});

/** @route GET /dashboard */
router.get('/dashboard', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const reservations = await Reservation.find();
        res.render('dashboard', { 
            userName: decoded.user.name || 'Utilisateur',
            email: decoded.user.email,
            date: new Date().toLocaleDateString('fr-FR'),
            reservations: reservations
        });
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/');
    }
});

/** @route GET /catways */
router.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find();
        const editId = req.query.editId || null; 
        res.render('catways', { catways, editId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement des catways.");
    }
});

/** @route POST /catways/add */
router.post('/catways/add', async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        await new Catway({ catwayNumber, catwayType, catwayState }).save();
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'ajout.");
    }
});

/** @route POST /catways/updateState/:id */
router.post('/catways/updateState/:id', async (req, res) => {
    try {
        await Catway.findByIdAndUpdate(req.params.id, { catwayState: req.body.catwayState });
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour.");
    }
});

/** @route GET /catways/delete/:id */
router.get('/catways/delete/:id', async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression.");
    }
});

/** @route GET /reservations */
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        const catways = await Catway.find();
        res.render('reservations', { reservations, catways, error: req.query.error, catwayId: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement.");
    }
});

/** @route POST /reservations/add */
router.post('/reservations/add', async (req, res) => {
    req.params.id = req.body.catwayNumber; 
    try {
        await reservationService.add(req, res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création de la réservation.");
    }
});

/** @route GET /reservations/:id */
router.get('/reservations/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    res.render('reservation-details', { reservation });
});

/** @route POST /reservations/update/:id */
router.post('/reservations/update/:id', async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
        const newStart = new Date(startDate).getTime();
        const newEnd = new Date(endDate).getTime();

        if (newStart >= newEnd) {
            return res.redirect(`/reservations/edit/${req.params.id}?error=invalid_dates`);
        }

        const conflicting = await Reservation.find({
            catwayNumber: Number(catwayNumber),
            _id: { $ne: req.params.id }
        });

        const hasConflict = conflicting.find(r => {
            const start = new Date(r.startDate).getTime();
            const end = new Date(r.endDate).getTime();
            return (start < newEnd && end > newStart);
        });

        if (hasConflict) {
            return res.redirect(`/reservations/edit/${req.params.id}?error=conflict`);
        }

        await Reservation.findByIdAndUpdate(req.params.id, { 
            catwayNumber, clientName, boatName, startDate, endDate 
        });
        
        res.redirect('/reservations');
    } catch (err) {
        res.status(500).send("Erreur de mise à jour");
    }
});

/** @route GET /reservations/delete/:id */
router.get('/reservations/delete/:id', async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
});

/** @route GET /reservations/edit/:id */
router.get('/reservations/edit/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render('reservation-edit', { reservation, error: req.query.error });
    } catch (error) {
        res.status(500).send("Erreur de chargement");
    }
});

/** @route GET /users */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        res.status(500).send("Erreur lors du chargement des utilisateurs.");
    }
});

/** @route POST /users/add */
router.post('/users/add', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({ username, email, password: hashedPassword }).save();
        res.redirect('/users');
    } catch (error) {
        console.error("Erreur création utilisateur :", error);
        res.status(500).send("Erreur lors de la création : " + error.message);
    }
});

/** @route GET /users/edit/:id */
router.get('/users/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('user-edit', { user });
});

/** @route POST /users/update/:id */
router.post('/users/update/:id', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let updateData = { username, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send("Erreur mise à jour");
    }
});

/** @route GET /users/delete/:id */
router.get('/users/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});

/** @route GET /logout */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;