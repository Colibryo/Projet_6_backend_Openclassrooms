const mongoose = require('mongoose');

//plugin -configuration pour empêcher de s'inscrire plusieurs fois avec le même email
const uniqueValidator = require('mongoose-unique-validator');

//schéma utilisé pour modèle - authentification par email et mot de passe
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//application du validateur au schema en passant uniquevalidator en argument du plugin
userSchema.plugin(uniqueValidator); 

//exporte le shéma appelé 'User' en tant que modèle
module.exports = mongoose.model('User', userSchema);