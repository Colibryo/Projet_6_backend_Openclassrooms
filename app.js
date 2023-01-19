//importation d'express
const express = require('express');

//importation de mongoose
const mongoose = require('mongoose');

//importe le router sauces
const saucesRoutes = require('./routes/sauces')

//importe le router user
const userRoutes = require('./routes/user')


//importé pour le chemin static
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();

//appel de la méthode express pour créer l'application express 
const app = express();

mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//intercepte toutes requêtes avec content type Json et met à disposition ce corps de la requête qui est parsé
app.use(express.json());

/*middleware général (pas de route spécifique pour s'appliquer à toutes les routes) utilisé par le serveur 
pour indiquer au navigateur qu'il peut utiliser l'api*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//middleware pour  les sauces avec la route attendue par le front end
app.use('/api/sauces', saucesRoutes);

//middleware pour enregistrer les routes avec la route attendue par le front end
app.use('/api/auth', userRoutes);

//ajout de la route pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

//export de la const app pour y accéder dans les autres fichier
module.exports = app;