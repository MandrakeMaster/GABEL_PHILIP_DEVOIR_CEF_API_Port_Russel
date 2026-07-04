/**
 * @file app.js
 * @description Configuration principale de l'application Express, moteurs de rendu et middlewares[cite: 8].
 */
const express       = require('express');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const mongodb       = require('./db/mongo');
const reservationsRouter = require('./routes/reservations');

/** Initialisation de la connexion à la base de données[cite: 8]. */
mongodb.initClientDbConnection();

const app = express();

/** Configuration du moteur de rendu EJS[cite: 8]. */
app.set('views', './views');     
app.set('view engine', 'ejs');   

/** Configuration des middlewares globaux[cite: 8]. */
app.use(cors({
    exposeHeaders: ['Authorization'],
    origin:  '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.static('public'));

/** Route de la documentation JSDoc[cite: 8]. */
app.use('/api-docs', express.static('out'));

/** Enregistrement des routeurs[cite: 8]. */
app.use('/', indexRouter);                                     
app.use('/users', usersRouter);
app.use('/catways', require('./routes/catways'));
app.use('/catways/:id/reservations', reservationsRouter);
app.use('/catway/:id/reservations', reservationsRouter);

/** Gestionnaire des routes non trouvées (404)[cite: 8]. */
app.use(function(req, res, next) {
    res.status(404).json({
        name: 'API', 
        version: '1.0', 
        status: '404', 
        message: 'not_found'
    });
});

module.exports = app;