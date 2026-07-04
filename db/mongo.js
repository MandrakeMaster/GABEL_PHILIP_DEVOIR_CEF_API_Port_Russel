/**
 * @file db/mongo.js
 * @description Initialisation de la connexion à la base de données MongoDB[cite: 15].
 */
const mongoose = require('mongoose');

const clientOptions = {
    dbName            : 'apinode'
};

/**
 * @function initClientDbConnection
 * @description Établit la connexion avec MongoDB en utilisant les variables d'environnement[cite: 15].
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;        
    }
}