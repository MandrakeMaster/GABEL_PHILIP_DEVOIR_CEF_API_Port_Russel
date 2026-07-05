# API Port de Plaisance

## Description
Cette API permet la gestion complète d'un port de plaisance. Elle inclut la gestion des catways, le suivi des réservations et l'administration des comptes utilisateurs.

## Installation
1. Cloner le dépôt : `git clone <url-du-repo>`
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement en créant un fichier `.env` à la racine contenant :
   `SECRET_KEY=ta_cle_secrete`

## Données de Test et Initialisation
Pour initialiser la base de données avec des données de test et créer un utilisateur administrateur, utilise le script d'initialisation fourni :
`node scripts/initDb.js`

## Création d'un premier utilisateur
Si vous préférez créer manuellement le premier compte utilisateur :
1. Utilisez la route `POST /users/add` via un outil comme Postman.
2. Ou insérez directement un document dans la collection `users` de votre base MongoDB :
   `db.users.insertOne({ username: "admin", email: "admin@port.fr", password: "motDePasseHache" })`

## Documentation
La documentation technique de l'API, générée via JSDoc, est accessible en local à l'adresse suivante une fois le serveur lancé :
`/api-docs`

