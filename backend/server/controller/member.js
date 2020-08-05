const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    db.query(
        `SELECT * FROM Members WHERE LOWER(email) = LOWER(${db.escape(
            req.body.email
        )})`, (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: `Cette adresse email est déjà utilisée !`
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        db.query(
                            `INSERT INTO Members (firstName, lastName, email, password) VALUES (
                            ${db.escape(req.body.firstName)},
                            ${db.escape(req.body.lastName)},
                            ${db.escape(req.body.email)},
                            ${db.escape(hash)})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    
                                }
                                return res.status(201).send({
                                    msg: 'Enregistré !!'
                                })
                            }
                        )
                    }
                })
            }
        }
    )
}

exports.login = (req, res, next) => {
    db.query(
        `SELECT * FROM Members WHERE email = ${db.escape(req.body.email)};`,
        (err, user) => {
            if (err) {
                return res.status(500).send({
                    msg: err
                });
            }

            if (!user.length) {
                return res.status(401).send({
                    msg: 'Adresse email ou mot de passe incorrecte'
                });
            }
            bcrypt.compare(req.body.password, user[0]['password'])
                .then(() => {
                        res.status(200).json({
                            userId: user.id,
                            token: jwt.sign({
                                    userId: user[0].id
                                },
                                'SECRETKEY', {
                                    expiresIn: '5h'
                                }
                            )
                        });
                    }
                )
                .catch((err) => res.status(500).json ({
                    err
                }))
        }
    )
}