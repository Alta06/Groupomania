const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db')
const userMiddleware = require('../middleware/users.js');

router.post('/signup', (req, res, next) => {
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
                                    return res.status(400).send({
                                        msg: err
                                    });
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
});

router.post('/login', (req, res, next) => {
    db.query(
        `SELECT * FROM Members WHERE email = ${db.escape(req.body.email)};`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(500).send({
                    msg: err
                });
            }

            if (!result.length) {
                return res.status(401).send({
                    msg: 'Adresse email ou mot de passe incorrecte'
                });
            }
            bcrypt.compare(
                req.body.password, result[0]['password'],
                (bErr, bResult) => {
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg: 'Adresse email ou mot de passe incorrecte'
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({
                            email: result[0].email,
                            userId: result[0].id
                        },
                        'SECRETKEY', {
                            expiresIn: '12h'
                        });
                        return res.status(200).send({
                            msg: 'Connecté',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect!'
                      });
                }
            )
        }
    )
});

router.get('/User', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;