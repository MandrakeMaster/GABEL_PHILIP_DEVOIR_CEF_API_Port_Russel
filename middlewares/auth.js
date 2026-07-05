/**
 * @file middlewares/auth.js
 * @description Middleware de vérification des jetons JWT via headers ou cookies.
 */
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @function checkJWT
 * @description Vérifie la validité du token JWT (headers ou cookies) et autorise l'accès.
 */
exports.checkJWT = async (req, res, next) => {
    // On récupère le token soit dans les headers, soit dans les cookies
    let token = req.headers['x-access-token'] || req.headers['authorization'] || (req.cookies && req.cookies.token);
    
    // Si le token est envoyé via Header Authorization (Bearer), on nettoie la chaîne
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                // Si le token est invalide, on renvoie une erreur (ou redirection pour les vues web)
                return res.status(401).json('token_not_valid');
            } else {
                // On injecte les infos décodées dans la requête pour y accéder plus tard
                req.decoded = decoded;

                // Optionnel : Régénération d'un nouveau token si besoin
                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign({
                    user: decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                res.header('Authorization', 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        // Pas de token présent
        return res.status(401).json('token_required');
    }
};