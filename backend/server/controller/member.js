const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.signUp = (req, res, next) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pass = req.body.password;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    //Si le mot de passe et l'email sont conforme à la REGEX
    if (pass.match(passRegex) && (email).match(emailRegex)) {

        bcrypt.hash(pass, 10)
            .then(hash => {
                //On vérifie que l'adresse email n'est pas déjà utilisée
                db.query(
                    `SELECT * FROM Members WHERE LOWER(email) =
                 LOWER(${db.escape(email)})`,

                    db.query(
                        `INSERT INTO Members (firstName, lastName, email, password) VALUES (
                                    ?, ?, ?, ?)`, [firstName, lastName, email, hash],

                        (error, result) => {
                            if (error) {
                                res.send({
                                    "code": 400,
                                    "message": "Cet adresse email est déja utilisée"
                                })
                            } else {
                                res.send({
                                    "code": 201,
                                    "message": "Utilisateur enregistré !"
                                })
                            }
                        }
                    )
                )
            })
            .catch(error => res.send({
                "code": 500,
                "message": error
            }))

    } else {
         res.send({
             "code": 400,
            "message": "Mot de passe ou adresse email incorrect"
        })
    }
}

exports.login = (req, res, next) => {

    db.query(
        `SELECT * FROM Members WHERE email = ?`, [req.body.email],
        (error, user) => {
            if (error) {
                res.send({
                    "code": 400,
                    "message": "Adresse email invalide"
                })
            }
            //Si on trouve une correspondance
            if (user.length > 0) {
                bcrypt.compare(req.body.password, user[0]['password'])
                    .then((valid) => {
                        if (valid) {

                            //On attribue un token
                            res.status(200).json({
                                userId: user[0].id,
                                token: jwt.sign({
                                        userId: user[0].id
                                    },
                                    `${process.env.sktdt}`, {
                                        expiresIn: '2h'
                                    }
                                )
                            });
                        } else {
                            res.send({
                                "code": 400,
                                "message": "Le nom d'utilisateur ou le mot de passe est invalide"
                            })
                        }
                    })
                    .catch((error) => ({
                        "code": 500,
                        "message": "Error" + error
                    }))
            } else {
                res.send({
                    "code": 400,
                    "message": "Utilisateur introuvable"
                })
            }
        }
    )
}

exports.getInfo = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;

    db.query(
        `SELECT * FROM Members WHERE id = ?`, [userId],
        (err, user) => {
            if (err) {
                res.send({
                    "code": 500,
                    "message": err
                });
            }

            res.send({
                "code":200,
                user
            })
        }
    )
}

exports.updateUser = (req, res, next) => {
    //Si l'utilisateur upload une image
    if (req.files) {

        const myFile = req.files.file;
        const newName = Date.now() + '-' + myFile.name;

        //On lui attribue un nouveau nom et elle est stockée dans le dossier correspondant
        myFile.mv(`images/profilePic/${newName}`, (err) => {
            if (err) {
                res.send({
                    "code": 500,
                    "message": err
                });
            }
        });

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
        const userId = decodedToken.userId;
        const image = {
            imageUrl: `${req.protocol}://${req.get('host')}/images/profilePic/${newName}`
        };

        db.query(
            `UPDATE Members 
        SET firstName=IF(LENGTH(?)=0, firstName, ?),
            lastName=IF(LENGTH(?)=0, lastName, ?),
            email=IF(LENGTH(?)=0, email, ?),
            inCompanySince=IF(LENGTH(?)=0, inCompanySince, ?),
            employement=IF(LENGTH(?)=0, employement, ?),
            birthday=IF(LENGTH(?)=0, birthday, ?),
            profilePic=?

            WHERE id=${db.escape(userId)}
                `, [req.body.firstName, req.body.firstName, req.body.lastName, req.body.lastName,
                req.body.email, req.body.email, req.body.inCompanySince, req.body.inCompanySince,
                req.body.employement, req.body.employement, req.body.birthday, req.body.birthday, image.imageUrl
            ],

            (error, result) => {
                if (error) {
                    res.send({
                        "code": 400,
                        "message": "Cet adresse email est déja utilisée"
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "Profil mis à jour !"
                    })
                }
            }
        )
    } else if (!req.files) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
        const userId = decodedToken.userId;

        db.query(
            `UPDATE Members 
        SET firstName=IF(LENGTH(?)=0, firstName, ?),
            lastName=IF(LENGTH(?)=0, lastName, ?),
            email=IF(LENGTH(?)=0, email, ?),
            inCompanySince=IF(LENGTH(?)=0, inCompanySince, ?),
            employement=IF(LENGTH(?)=0, employement, ?),
            birthday=IF(LENGTH(?)=0, birthday, ?)

            WHERE id=?
                `, [req.body.firstName, req.body.firstName, req.body.lastName, req.body.lastName,
                req.body.email, req.body.email, req.body.inCompanySince, req.body.inCompanySince,
                req.body.employement, req.body.employement, req.body.birthday, req.body.birthday, userId
            ],
            (error, result) => {
                if (error) {
                    res.send({
                        "code": 400,
                        "message": "Cet adresse email est déja utilisée",
                        "error": error
                    })

                } else {
                    res.send({
                        "code": 200,
                        "message": "Profil mis à jour !"
                    })
                }
            }
        )
    }
}

exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.sktdt}`);
    const userId = decodedToken.userId;

    db.query(
        `SELECT profilePic FROM Members WHERE id = ?`, [userId],
        (err, result) => {
            if (err) {
                res.send({
                    "code": 400,
                    "message": "erreur"
                })
            }
            //Si l'utilisateur n'a pas modifié sa photo de profil
            if (result[0].profilePic == null) {

                db.query(
                    `DELETE FROM Members WHERE id=?`, [userId],
                    (err, result) => {
                        if (err) {
                            res.send({
                                "code": 500,
                                "message": err
                            });
                        } else {
                            res.send({
                                "code": 200,
                                "message": "Compte détruit",
                                result
                            })
                        }
                    }
                )
            } else {
                let imageUrl = result[0].profilePic;
                let fileName = imageUrl.split('/images/profilePic')[1];

                fs.unlink(`images/profilePic` + fileName, () => {});

                db.query(
                    `DELETE FROM Members WHERE id=?`, [userId],
                    (err, result) => {
                        if (err) {
                            return res.send({
                                "code": 500,
                                "message": err
                            });
                        } else {
                            return res.send({
                                "code": 200,
                                "message": "Compte détruit",
                                result
                            })
                        }
                    }
                )
            }
        }
    )
}