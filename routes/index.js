const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Reservation = require('../models/reservation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'ton_secret_key';

const Catway = require('../models/catway');

router.get('/', (req, res) => {
    res.render('index', { title: 'Port de Plaisance', error: null });
});

// --- Route pour l'authentification
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

// --- Route unique pour le dashboard ---
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

// --- Gestion des Catways ---

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

router.post('/catways/updateState/:id', async (req, res) => {
    try {
        await Catway.findByIdAndUpdate(req.params.id, { catwayState: req.body.catwayState });
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour.");
    }
});

router.get('/catways/delete/:id', async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression.");
    }
});

// --- Gestion des Réservations ---

router.get('/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.render('reservations', { reservations });
});

// Ajout avec vérification d'état du Catway
router.post('/reservations/add', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (catway && (catway.catwayState.toLowerCase().includes('réparation') || catway.catwayState.toLowerCase().includes('indisponible'))) {
            return res.status(400).send("Erreur : Ce catway est en réparation ou indisponible.");
        }
        await new Reservation(req.body).save();
        res.redirect('/reservations');
    } catch (err) { res.status(500).send("Erreur ajout"); }
});

router.get('/reservations/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    res.render('reservation-details', { reservation });
});

router.get('/reservations/edit/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render('reservation-edit', { reservation });
    } catch (error) {
        res.status(500).send("Erreur de chargement");
    }
});

router.post('/reservations/update/:id', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (catway && (catway.catwayState.toLowerCase().includes('réparation') || catway.catwayState.toLowerCase().includes('indisponible'))) {
            return res.status(400).send("Ce catway est en réparation.");
        }
        await Reservation.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/reservations');
    } catch (err) {
        res.status(500).send("Erreur de mise à jour");
    }
});

router.get('/reservations/delete/:id', async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
});



// --- Gestion des Utilisateurs ---

// 1. Liste des utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        res.status(500).send("Erreur lors du chargement des utilisateurs.");
    }
});

// 2. Création (Route POST)
router.post('/users/add', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hashedPassword }).save();
        res.redirect('/users');
    } catch (error) {
        res.status(500).send("Erreur lors de la création.");
    }
});

// 3. Modifier (Formulaire)
router.get('/users/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('user-edit', { user });
});

router.post('/users/update/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let updateData = { name, email };
        
        // On ne met à jour le mot de passe que s'il est fourni
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send("Erreur mise à jour");
    }
});

// 4. Supprimer
router.get('/users/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});



// --- Déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;