/**
 * @file app.js
 * @description Configuration principale de l'application Express, moteurs de rendu et middlewares.
 */
const express       = require('express');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');
const path          = require('path');

const indexRouter   = require('./routes/indexRoute');
const usersRouter   = require('./routes/usersRoute');
const catwaysRouter = require('./routes/catwaysRoute');
const reservationsRouter = require('./routes/reservationsRoute');
const mongodb       = require('./db/mongo');

/** Initialisation de la connexion à la base de données MongoDB. */
mongodb.initClientDbConnection();

const app = express();

/** Configuration du moteur de rendu EJS. */
app.set('views', './views');     
app.set('view engine', 'ejs');   

/** 
 * @description Configuration des middlewares globaux pour la gestion des requêtes, 
 * de la sécurité CORS et des fichiers statiques. 
 */
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

/** @description Enregistrement des routeurs de l'application. */
app.use('/', indexRouter);                                     
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter); 
app.use('/reservations', reservationsRouter);

/** 
 * @function 404-handler
 * @description Gestionnaire d'erreurs pour les routes non trouvées (404). 
 */
app.use(function(req, res, next) {
    res.status(404).json({
        name: 'API', 
        version: '1.0', 
        status: '404', 
        message: 'not_found'
    });
});

module.exports = app;
