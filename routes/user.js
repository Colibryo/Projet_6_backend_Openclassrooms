const express = require('express');

//création router avec la méthode router d'express
const router = express.Router();

const userCtrl = require('../controllers/user');
//définition des routes pour la création et la connxion de l'utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//exporte router pour app
module.exports = router