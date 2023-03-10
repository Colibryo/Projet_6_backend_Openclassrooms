const Sauce = require('../models/sauces');

const fs = require('fs');

// création d'une sauce avec un fichier image en utilisant la reqûete en paramètres et le modèle de la sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  //objet sans les champs supprimés
  const sauce = new Sauce({
    ...sauceObject,
    //extrait le userid de la req grâce au middleware
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée avec succès!' }))
    .catch(error => res.status(400).json({ error: error }));
};

/*possibilités de liker, de ne pas liker ou d'enlever son like en utilisant la requête du frontend en paramètre
dont le userId et la valeur du like (0 : enlève le like, 1 : like, -1 : dislike)
l'utilisateur est ajouté ou enlevé de la table des personnes ayant liké ou disliké selon son like */
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const sauceLike = req.body;
      const foundUsersLiked = sauce.usersLiked.includes(req.body.userId)
      const foundUsersDisliked = sauce.usersDisliked.includes(req.body.userId)
      const like = sauceLike.like

      switch (like) {

        case 1:
          if (foundUsersLiked == false) {
            sauce["likes"]++
            sauce.usersLiked.push(req.body.userId)
          }
          sauce.save()
            .then(() => res.status(201).json({ message: 'Sauce likée ' }))
            .catch(error => res.status(400).json({ error: error }));
          break;

        case -1:
          if (foundUsersDisliked == false) {
            sauce["dislikes"]++
            sauce.usersDisliked.push(req.body.userId)
          }
          sauce.save()
            .then(() => res.status(201).json({ message: 'Sauce dislikée!' }))
            .catch(error => res.status(400).json({ error: error }));
          break;

        case 0:
          if (foundUsersLiked == true) {
            sauce["likes"]--
            sauce.usersLiked = sauce.usersLiked.filter(users => users != req.body.userId);

          }
          else if (foundUsersDisliked == true) {
            sauce["dislikes"]--
            sauce.usersDisliked = sauce.usersDisliked.filter(users => users != req.body.userId);
          }
          sauce.save()
            .then(() => res.status(201).json({ message: 'Like ou dislike annulé!' }))
            .catch(error => res.status(400).json({ error: error }));
          break;
      }
    })

}
//modification des sauces par son créateur
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  //suppression du userId pour éviter que l'utilisateur créé un objet et le modifie pour le réassigner à quelqu'un d'autre
  delete sauceObject._userId;
  
  //récupération de l'objet en base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Requête non autorisée' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}` , () => { 
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(201).json({ message: 'Sauce modifiée avec succès!' }))
          .catch(error => res.status(401).json({ error: error }));
        });
      }
      
    })
};

//suppression des sauces par son créateur
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Requête non autorisée' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};
//récupération d'une seule sauce en utilisant l'id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error: error }));
};
//récupération de toutes les sauces 
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};