const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const User = require('../models/user');

//méthode pour la création de l'utilisateur 
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //création utilisateur avec le modèle mongoose user
            const user = new User({
                email: req.body.email,
                password: hash

            });

            //sauvegarde du user dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

 
//méthode pour vérifier la connexion de l'utilisateur 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                     
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                        
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };