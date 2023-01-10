const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const User = require('../models/user');

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
      console.log(res)
};

exports.login = (req, res, next) => { 
    console.log(req)
    /*méthode  à laquelle on passe un objet qui sert de filtre avec champ email et la valeur émise par le client */
    User.findOne({email: req.body.email})
        .then(user => {
            //vérifie le cas où l'utilisateur n'existe pas 
            if (user === nul) {
                return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect' });
            }
            //compare ce qui est envoyé par client et ce qui est dans la base de donnée - vérifie le mot de passe
            else{
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // cas où le mot de passe est incorrecte
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect' });
                    }
                    else {
                        
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    }
                })
                .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};