const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const pass = req.body.password;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (pass.match(passRegex) && (req.body.email).match(emailRegex)) {
        bcrypt.hash(pass, 10)
            .then(hash => {
                db.query(
                    `SELECT * FROM Members WHERE LOWER(email) =
                 LOWER(${db.escape(req.body.email)})`,
                    db.query(
                        `INSERT INTO Members (firstName, lastName, email, password) VALUES (
                                    ${db.escape(req.body.firstName)},
                                    ${db.escape(req.body.lastName)},
                                    ${db.escape(req.body.email)},
                                    ${db.escape(hash)})`,
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            return res.status(201).send({
                                msg: 'Enregistré !!',
                                result
                            })
                        }
                    )
                  )
            })
            .catch(error => res.status(500).json({
                error: error
            }))
    } else {
        throw new Error("Mdp ou email incorrect"); 
        }
    }



exports.login = (req, res, next) => {
    db.query(
        `SELECT * FROM Members WHERE email = ${db.escape(req.body.email)};`,
        (error, user) => {
            if (error) {
                return res.status(401).send({
                    error: "Utilisateur non trouvé"
                });
            }

            bcrypt.compare(req.body.password, user[0]['password']) 
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect'
                        });
                    }
                    res.status(200).json({
                        userId: user[0].id,
                        token: jwt.sign({
                                userId: user[0].id
                            },
                            'SECRETKEY', {
                                expiresIn: '5h'
                            }
                        )
                    });
                })
                .catch((err) => res.status(500).json({
                    err
                }))
        }
    )
}

exports.getInfo = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    db.query(
        `SELECT * FROM Members WHERE id = ${db.escape(userId)}`,
        (err, user) => {
            if (err) {
                return res.status(500).send({
                    msg: err
                });
            }

            res.status(200).json({
                user
            })
        }
    )
}

exports.updateUser = (req, res, next) => {
    if (!req.files) {
        return res.status(500).send({
            msg: "file is not found"
        })
    }
    // accessing the file
    const myFile = req.files.file;
    const newName = Date.now() + '-' + myFile.name;

    //  mv() method places the file inside image directory
    myFile.mv(`images/profilePic/${newName}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({
                msg: "Error occured"
            });
        }

    });

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    const image = {
        imageUrl: `${req.protocol}://${req.get('host')}/images/profilePic/${newName}`
    };

        
    db.query(
        `UPDATE Members 
                SET firstName=IF(LENGTH(${db.escape(req.body.firstName)})=0, firstName, ${db.escape(req.body.firstName)}),
                    lastName=IF(LENGTH(${db.escape(req.body.lastName)})=0, lastName, ${db.escape(req.body.lastName)}),
                    email=IF(LENGTH(${db.escape(req.body.email)})=0, email, ${db.escape(req.body.email)}),
                    inCompanySince=IF(LENGTH(${db.escape(req.body.inCompanySince)})=0, inCompanySince, ${db.escape(req.body.inCompanySince)}),
                    employement=IF(LENGTH(${db.escape(req.body.employement)})=0, employement, ${db.escape(req.body.employement)}),
                    birthday=IF(LENGTH(${db.escape(req.body.birthday)})=0, birthday, ${db.escape(req.body.birthday)}),
                    profilePic=IF(LENGTH(${db.escape(image.imageUrl)})=0, profilePic, ${db.escape(image.imageUrl)})

                    WHERE id=${db.escape(userId)}
                `,
        (err, result) => {
            if (err) {
                console.log("error: "+ req.body)
                return res.status(500).send({
                    err: err
                })
            } else {
                console.log(req.body)
                return res.status(201).send({
                    msg: 'Utilisateur mis à jour !!',
                    result
                })
            }
        }
    )
}

exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRETKEY');
    const userId = decodedToken.userId;
    db.query(
        `DELETE FROM Members WHERE id=${db.escape(userId)}`,
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    err: err
                });
            } else {
                return res.status(200).send({
                    msg: "Compte détruit",
                    result
                })
            }
        }
    )
}
    
