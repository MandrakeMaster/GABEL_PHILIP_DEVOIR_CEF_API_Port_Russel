# API Capitainerie de Russell

Application de gestion de port de plaisance permettant le suivi des catways, des réservations et l'authentification des agents portuaires.

## Installation

1.  **Cloner le dépôt** :
    ```bash
    git clone <url-du-depot>
    ```
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
3.  **Configuration** :
    Créer un fichier `.env` à la racine du projet avec les variables suivantes :
    *   `MONGO_URL` : Votre chaîne de connexion MongoDB[cite: 8].
    *   `SECRET_KEY` : Clé secrète pour la signature des tokens JWT[cite: 2, 7].
    *   `PORT` : Port d'écoute du serveur (par défaut 3000).

4.  **Démarrage** :
    ```bash
    npm start
    ```

## Documentation

La documentation technique est générée via JSDoc[cite: 8].
*   **Accès rapide** : Disponible directement via l'application sur la route `/api-docs`[cite: 8].
*   **Génération manuelle** : Si vous avez modifié le code, vous pouvez regénérer la documentation locale avec :
    ```bash
    npm run doc
    ```

## Fonctionnalités

*   **Gestion des utilisateurs** : Inscription et authentification sécurisée via JWT[cite: 2, 7].
*   **Gestion des catways** : CRUD complet pour le suivi des emplacements et de leur état[cite: 5].
*   **Gestion des réservations** : Création, modification et suppression avec vérification automatique des conflits de dates et de disponibilité des catways[cite: 6].
