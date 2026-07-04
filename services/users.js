/**
 * @file services/users.js
 * @description Gestion des utilisateurs, authentification et CRUD[cite: 7].
 */
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/** @function getAll - Liste tous les utilisateurs[cite: 7]. */
exports.getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(501).json(error);
    }
};

/** @function add - Crée un utilisateur[cite: 7]. */
exports.add = async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        console.error("ERREUR CAPTURÉE :", error);
        res.status(501).json({ message: "Erreur lors de la création", detail: error.message });
    }
};

/** @function getByEmail - Récupère un utilisateur par email[cite: 7]. */
exports.getByEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user) return res.status(200).json(user);
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
};

/** @function update - Modifie un utilisateur existant[cite: 7]. */
exports.update = async (req, res, next) => {
    const email = req.params.email;
    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    try {
        let user = await User.findOne({ email: email});
        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });
            await user.save();
            return res.status(201).json(user);
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
};

/** @function delete - Supprime un utilisateur[cite: 7]. */
exports.delete = async (req, res, next) => {
    const email = req.params.email;
    try {
        await User.deleteOne({ email: email });
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
};

/** @function login - Authentification JWT[cite: 7]. */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');
        if (user) {
            bcrypt.compare(password, user.password, function(err, response) {
                if (err) throw new Error(err);
                if (response) {
                    delete user._doc.password;
                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: expireIn });
                    res.header('Authorization', 'Bearer ' + token);
                    return res.status(200).json('authenticate_succeed');
                }
                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
};