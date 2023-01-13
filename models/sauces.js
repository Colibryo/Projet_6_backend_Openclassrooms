const mongoose = require('mongoose');

//schéma utilisé pour modèle - authentification par email et mot de passe
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: true },
    dislikes: { type: Number, default: true },
    usersLiked: [String],
    usersDisliked: [String],
});
//exporte le schéma appelé 'Sauce' en tant que modèle
module.exports = mongoose.model('Sauce', sauceSchema);