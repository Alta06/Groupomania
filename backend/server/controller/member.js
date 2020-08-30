const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signUp = (req, res, next) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pass = req.body.password;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (pass.match(passRegex) && (email).match(emailRegex)) { 

            bcrypt.hash(pass, 10)
            .then(hash => {
                db.query(
                    `SELECT * FROM Members WHERE LOWER(email) =
                 LOWER(${db.escape(email)})`,

                    db.query(
                        `INSERT INTO Members (firstName, lastName, email, password) VALUES (
                                    ${db.escape(firstName)},
                                    ${db.escape(lastName)},
                                    ${db.escape(email)},
                                    ${db.escape(hash)})`,

                        (error, result) => {
                            if (error) {
                                res.send({
                                    "code":400,
                                    "message":"Cet adresse email est déja utilisée"
                                })
                            }else {
                                console.log(req.body)
                                res.send({
                                    "code":200,
                                    "message":"user registred"
                                })
                            }
                        }
                    )
                )
            })
            .catch(error => res.status(500).json({
                error: error
            }))    
       
    } else {
        return res.status(500).send({
            msg: "Mot de passe ou adresse email incorrect"
        })
    }
}

exports.login = (req, res, next) => {
    
    db.query(
        `SELECT * FROM Members WHERE email = ?`, [req.body.email],
        (error, user) => {
            if (error) {
                res.send({
                    "code":400,
                    "message":"Adresse email invalide"
                })
            }
             if (user.length > 0) {
                bcrypt.compare(req.body.password, user[0]['password'])
                .then((valid) => {
                    if (valid) {

                    res.status(200).json({
                        userId: user[0].id,
                        token: jwt.sign({
                                userId: user[0].id
                            },
                            `${process.env.sktdt}`, {
                                expiresIn: '5h'
                            }
                        )
                    });
                    } else {
                        res.send({
                            "code":400,
                            "message":"Le mot de passe est invalide"
                        })
                    }
                })
                .catch((error) => ({
                    "code":400,
                    "message": "voici l'erreur",
                    error
                }))
            } else {
                res.send({
                    "code":401,
                    "message":"Utilisateur introuvable"
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
    if (req.files) {
     
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
                    req.body.employement, req.body.employement, req.body.birthday, req.body.birthday, image.imageUrl],
                (error, result) => {
                    if (error) {
                        res.send({
                            "code":400,
                            "message":"Cet adresse email est déja utilisée"
                        })
                    }else {
                        res.send({
                            "code":200,
                            "message":"Profil mis à jour !"
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

            WHERE id=${db.escape(userId)}
                `, [req.body.firstName, req.body.firstName, req.body.lastName, req.body.lastName,
                    req.body.email, req.body.email, req.body.inCompanySince, req.body.inCompanySince,
                    req.body.employement, req.body.employement, req.body.birthday, req.body.birthday],
                (error, result) => {
                    if (error) {
                        res.send({
                            "code":400,
                            "message":"Cet adresse email est déja utilisée",
                            "error": error
                        })
                    }else {

                        res.send({
                            "code":200,
                            "message":"Profil mis à jour !"
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
        `DELETE FROM Members WHERE id=?`,[userId],
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