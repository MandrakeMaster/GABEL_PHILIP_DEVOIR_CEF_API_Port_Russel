const express       = require('express');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const mongodb       = require('./db/mongo');
const reservationsRouter = require('./routes/reservations');

mongodb.initClientDbConnection();

const app = express();

// --- Configuration des Vues (EJS) ---
app.set('views', './views');     
app.set('view engine', 'ejs');   


app.use(cors({
    exposeHeaders: ['Authorization'],
    origin:  '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.static('public'));
app.use('/api-docs', express.static('out'));


app.use('/', indexRouter);                                     
app.use('/users', require('./routes/users'));

app.use('/catways', require('./routes/catways'));
app.use('/catways/:id/reservations', reservationsRouter);
app.use('/catway/:id/reservations', reservationsRouter);

// Gestion 404 
app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: '404', message: 'not_found'});
});

module.exports = app;