module.exports = {
    validateRegister: (req, res, next) => {
     /*    if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                msg: 'Le mot de passe doit contenir 6 caractères minimum'
            });
        } */
        
        if (!req.body.password_repeat ||
            req.body.password != req.body.password_repeat) {
                return res.status(400).send({
                    msg: 'Les mots de passe ne correspondent pas'
                });
            }

            next();
    },

    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
              token,
              'SECRETKEY'
            );
            req.userData = decoded;
            next();
          } catch (err) {
            return res.status(401).send({
              msg: 'Your session is not valid!'
            });
          }
    }

}