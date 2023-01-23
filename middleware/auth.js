const jwt = require('jsonwebtoken');

//middleware qui extrait le token et vérifie s'il est valide (importé dans router pour son exécution)
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();

   } catch(error) {
       res.status(403).json({ error });
   }
};